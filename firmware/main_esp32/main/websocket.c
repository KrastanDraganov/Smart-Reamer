#include <esp_event.h>
#include <esp_log.h>
#include <esp_system.h>
#include <esp_mac.h>
#include <esp_random.h>
#include <esp_timer.h>
#include <nvs_flash.h>
#include <sys/param.h>
#include "app.h"
#include "config.h"
#include "esp_netif.h"
#include "esp_eth.h"
#include "esp_wifi.h"
#include "ext_api.h"
#include "lwip/sockets.h"
#include <esp_https_server.h>
#include "sdkconfig.h"

#if !CONFIG_HTTPD_WS_SUPPORT
#error This code cannot be used unless HTTPD_WS_SUPPORT is enabled in esp-http-server component configuration
#endif

#define MAX_ACTION_VALUE_SIZE 512

static char response[4096]                = {0};
static char action[MAX_ACTION_VALUE_SIZE] = {0};

struct async_resp_arg {
		httpd_handle_t hd;
		int            fd;
};

static const char* TAG = "websocket_server";

static httpd_handle_t s_server_handle = NULL;
static bool s_is_locked = true;

/* ---- Token auth storage ---- */
static char s_tokens[MAX_PAIRED_DEVICES][65] = {{0}};
static int  s_token_count = 0;
static bool s_auth_enabled = false;

/* ---- Lock state persistence via NVS ---- */
void ws_init_lock_state(void) {
	nvs_handle_t h;
	if (nvs_open(NVS_NAMESPACE_LOCK, NVS_READWRITE, &h) == ESP_OK) {
		uint8_t val = 1;
		if (nvs_get_u8(h, NVS_KEY_LOCK_STATE, &val) == ESP_OK) {
			s_is_locked = (val != 0);
		}
		nvs_close(h);
	}

	long target = s_is_locked ? LOCK_MOTOR_POS_LOCKED : LOCK_MOTOR_POS_UNLOCKED;
	smart_reamer_ex_motor_go_to_steps(target);

	/* Load saved tokens */
	nvs_handle_t ah;
	if (nvs_open(NVS_NAMESPACE_AUTH, NVS_READWRITE, &ah) == ESP_OK) {
		s_token_count = 0;
		for (int i = 0; i < MAX_PAIRED_DEVICES; i++) {
			char key[8];
			snprintf(key, sizeof(key), "%s%d", NVS_KEY_TOKEN_PREFIX, i);
			size_t len = sizeof(s_tokens[i]);
			if (nvs_get_str(ah, key, s_tokens[i], &len) == ESP_OK && len > 1) {
				s_token_count++;
				s_auth_enabled = true;
			}
		}
		nvs_close(ah);
	}

	ESP_LOGI(TAG, "Lock state: %s, paired devices: %d", s_is_locked ? "locked" : "unlocked", s_token_count);
}

static void persist_lock_state(bool locked) {
	nvs_handle_t h;
	if (nvs_open(NVS_NAMESPACE_LOCK, NVS_READWRITE, &h) == ESP_OK) {
		nvs_set_u8(h, NVS_KEY_LOCK_STATE, locked ? 1 : 0);
		nvs_commit(h);
		nvs_close(h);
	}
}

bool ws_get_lock_state(void) {
	return s_is_locked;
}

void ws_set_server_handle(httpd_handle_t server) {
	s_server_handle = server;
}

/* ---- Token auth ---- */
static bool validate_token(const char* token) {
	if (!s_auth_enabled) return true;
	if (!token || token[0] == '\0') return false;
	for (int i = 0; i < MAX_PAIRED_DEVICES; i++) {
		if (s_tokens[i][0] != '\0' && strcmp(s_tokens[i], token) == 0) {
			return true;
		}
	}
	return false;
}

static bool store_new_token(const char* token) {
	nvs_handle_t h;
	for (int i = 0; i < MAX_PAIRED_DEVICES; i++) {
		if (s_tokens[i][0] == '\0') {
			strncpy(s_tokens[i], token, 64);
			s_tokens[i][64] = '\0';
			s_token_count++;
			s_auth_enabled = true;

			if (nvs_open(NVS_NAMESPACE_AUTH, NVS_READWRITE, &h) == ESP_OK) {
				char key[8];
				snprintf(key, sizeof(key), "%s%d", NVS_KEY_TOKEN_PREFIX, i);
				nvs_set_str(h, key, token);
				nvs_commit(h);
				nvs_close(h);
			}
			return true;
		}
	}
	return false;
}

static void generate_token(char* out, size_t out_len) {
	uint8_t bytes[16];
	esp_fill_random(bytes, sizeof(bytes));
	for (int i = 0; i < 16 && (i * 2 + 2) < (int)out_len; i++) {
		snprintf(out + i * 2, 3, "%02x", bytes[i]);
	}
	out[32] = '\0';
}

/* ---- WebSocket helpers ---- */
esp_err_t respond_str(httpd_req_t* req, const char* str) {
	httpd_ws_frame_t frame;

	frame.type    = HTTPD_WS_TYPE_TEXT;
	frame.payload = (uint8_t*)str;
	frame.len     = strlen(str);
	frame.final   = true;

	return httpd_ws_send_frame(req, &frame);
}

esp_err_t extract_value(char* value, const char* payload, const char* key) {
	char* act_pos = strstr(payload, key);
	if (act_pos) {
		char* start = strchr(act_pos, ':');
		if (start) {
			start++;
			while (*start == ' ') {
				start++;
			}

			char* end = NULL;
			if (*start == '\"') {
				start++;
				end = strchr(start, '\"');
			} else {
				end = strpbrk(start, ",}");
			}

			if (end && (end - start) < MAX_ACTION_VALUE_SIZE) {
				strncpy(value, start, end - start);
				value[end - start] = '\0';
				return ESP_OK;
			}
		}
	}

	return ESP_FAIL;
}

/* ---- Broadcast to all connected WS clients ---- */
void ws_broadcast_lock_status(bool is_locked) {
	if (!s_server_handle) return;

	char msg[128];
	snprintf(msg, sizeof(msg),
		"{\"event\":\"status_change\",\"isLocked\":%s,\"timestamp\":%lld}",
		is_locked ? "true" : "false",
		(long long)(esp_timer_get_time() / 1000000));

	httpd_ws_frame_t frame = {
		.type    = HTTPD_WS_TYPE_TEXT,
		.payload = (uint8_t*)msg,
		.len     = strlen(msg),
		.final   = true
	};

	size_t clients = WS_MAX_CLIENTS;
	int client_fds[WS_MAX_CLIENTS];
	if (httpd_get_client_list(s_server_handle, &clients, client_fds) == ESP_OK) {
		for (size_t i = 0; i < clients; i++) {
			if (httpd_ws_get_fd_info(s_server_handle, client_fds[i]) == HTTPD_WS_CLIENT_WEBSOCKET) {
				httpd_ws_send_frame_async(s_server_handle, client_fds[i], &frame);
			}
		}
	}
}

/* ---- Lock / Unlock via motor ---- */
static void do_lock(void) {
	s_is_locked = true;
	smart_reamer_ex_motor_go_to_steps(LOCK_MOTOR_POS_LOCKED);
	persist_lock_state(true);
	ESP_LOGI(TAG, "Lock command executed");
}

static void do_unlock(void) {
	s_is_locked = false;
	smart_reamer_ex_motor_go_to_steps(LOCK_MOTOR_POS_UNLOCKED);
	persist_lock_state(false);
	ESP_LOGI(TAG, "Unlock command executed");
}

/* ---- Get device MAC as string ---- */
static void get_mac_string(char* out, size_t out_len) {
	uint8_t mac[6];
	esp_read_mac(mac, ESP_MAC_WIFI_STA);
	snprintf(out, out_len, "%02X:%02X:%02X:%02X:%02X:%02X",
		mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
}

/* ---- WebSocket handler ---- */
static esp_err_t ws_handler(httpd_req_t* req) {
	if (req->method == HTTP_GET) {
		ESP_LOGI(TAG, "Handshake done, the new connection was opened");
		return ESP_OK;
	}
	httpd_ws_frame_t ws_pkt;
	uint8_t*         buf = NULL;
	memset(&ws_pkt, 0, sizeof(httpd_ws_frame_t));

	esp_err_t ret = httpd_ws_recv_frame(req, &ws_pkt, 0);
	if (ret != ESP_OK) {
		ESP_LOGE(TAG, "httpd_ws_recv_frame failed to get frame len with %d", ret);
		return ret;
	}
	if (ws_pkt.len) {
		buf = calloc(1, ws_pkt.len + 1);
		if (buf == NULL) {
			ESP_LOGE(TAG, "Failed to calloc memory for buf");
			return ESP_ERR_NO_MEM;
		}
		ws_pkt.payload = buf;
		ret = httpd_ws_recv_frame(req, &ws_pkt, ws_pkt.len);
		if (ret != ESP_OK) {
			ESP_LOGE(TAG, "httpd_ws_recv_frame failed with %d", ret);
			free(buf);
			return ret;
		}
	}

	if (ws_pkt.type == HTTPD_WS_TYPE_TEXT || ws_pkt.type == HTTPD_WS_TYPE_PING || ws_pkt.type == HTTPD_WS_TYPE_CLOSE) {
		if (ws_pkt.type == HTTPD_WS_TYPE_TEXT) {
			char* payload = (char*)ws_pkt.payload;

			char id_str[10] = {0};
			extract_value(id_str, payload, "\"id\"");
			int id = atoi(id_str);

			extract_value(action, payload, "\"action\"");

			char token[MAX_ACTION_VALUE_SIZE] = {0};
			extract_value(token, payload, "\"token\"");

			/* --- pair: no auth required --- */
			if (strcmp(action, "pair") == 0) {
				if (s_token_count >= MAX_PAIRED_DEVICES) {
					snprintf(response, sizeof(response),
						"{\"id\":%d,\"status\":\"error\",\"message\":\"max paired devices reached\"}", id);
					respond_str(req, response);
				} else {
					char new_token[65] = {0};
					generate_token(new_token, sizeof(new_token));
					char mac[18] = {0};
					get_mac_string(mac, sizeof(mac));

					if (store_new_token(new_token)) {
						snprintf(response, sizeof(response),
							"{\"id\":%d,\"status\":\"ok\",\"token\":\"%s\",\"deviceId\":\"%s\"}", id, new_token, mac);
					} else {
						snprintf(response, sizeof(response),
							"{\"id\":%d,\"status\":\"error\",\"message\":\"storage full\"}", id);
					}
					respond_str(req, response);
				}
			}

			/* --- All actions below require valid token if auth is enabled --- */
			else if (!validate_token(token)) {
				snprintf(response, sizeof(response),
					"{\"id\":%d,\"status\":\"error\",\"message\":\"invalid token\"}", id);
				respond_str(req, response);
			}

			else if (strcmp(action, "lock") == 0) {
				do_lock();
				snprintf(response, sizeof(response),
					"{\"id\":%d,\"status\":\"ok\",\"isLocked\":true}", id);
				respond_str(req, response);
				ws_broadcast_lock_status(true);

			} else if (strcmp(action, "unlock") == 0) {
				do_unlock();
				snprintf(response, sizeof(response),
					"{\"id\":%d,\"status\":\"ok\",\"isLocked\":false}", id);
				respond_str(req, response);
				ws_broadcast_lock_status(false);

			} else if (strcmp(action, "get_status") == 0) {
				snprintf(response, sizeof(response),
					"{\"id\":%d,\"status\":\"ok\",\"isLocked\":%s,\"isOnline\":true}",
					id, s_is_locked ? "true" : "false");
				respond_str(req, response);

			} else if (strcmp(action, "get_info") == 0) {
				char mac[18] = {0};
				get_mac_string(mac, sizeof(mac));
				snprintf(response, sizeof(response),
					"{\"id\":%d,\"status\":\"ok\",\"deviceId\":\"%s\",\"firmwareVersion\":\"%s\",\"name\":\"%s\"}",
					id, mac, FIRMWARE_VERSION, CFG_WIFI_SSID);
				respond_str(req, response);

			} else if (strcmp(action, "configure_wifi") == 0) {
				char ssid[64] = {0};
				char password[64] = {0};
				extract_value(ssid, payload, "\"ssid\"");
				extract_value(password, payload, "\"password\"");

				if (ssid[0] == '\0') {
					snprintf(response, sizeof(response),
						"{\"id\":%d,\"status\":\"error\",\"message\":\"ssid required\"}", id);
					respond_str(req, response);
				} else {
					nvs_handle_t wh;
					if (nvs_open(NVS_NAMESPACE_WIFI, NVS_READWRITE, &wh) == ESP_OK) {
						nvs_set_str(wh, NVS_KEY_STA_SSID, ssid);
						nvs_set_str(wh, NVS_KEY_STA_PASS, password);
						nvs_set_u8(wh, NVS_KEY_PROVISIONED, 1);
						nvs_commit(wh);
						nvs_close(wh);
					}
					snprintf(response, sizeof(response),
						"{\"id\":%d,\"status\":\"ok\",\"message\":\"wifi configured, restart to apply\"}", id);
					respond_str(req, response);
					ESP_LOGI(TAG, "WiFi provisioned: SSID=%s", ssid);
				}

			/* --- Original measurement actions --- */
			} else if (strcmp(action, "get_measurements") == 0) {
				snprintf(response, sizeof(response), "{\"id\":%d, %s}", id, smart_reamer_measure_get_json());
				respond_str(req, response);
				smart_reamer_measure_finished_using_json();
			} else if (strcmp(action, "get_measurements_oneshot") == 0) {
				snprintf(response, sizeof(response), "{\"id\":%d, %s}", id, smart_reamer_measure_get_oneshot());

				respond_str(req, response);
				smart_reamer_measure_finished_using_json();
			} else if (strcmp(action, "enable_measure") == 0) {
				char name[MAX_ACTION_VALUE_SIZE] = {0};
				extract_value(name, payload, "\"name\"");
				smart_reamer_measure_enable_val(name);

				snprintf(response, sizeof(response), "{\"id\":%d, \"status\":\"ok\"}", id);
				respond_str(req, response);
			} else if (strcmp(action, "edit_config") == 0) {
				char name[MAX_ACTION_VALUE_SIZE]      = {0};
				char value_str[MAX_ACTION_VALUE_SIZE] = {0};

				extract_value(name, payload, "\"name\"");
				extract_value(value_str, payload, "\"value\"");

				smart_reamer_edit_config(name, value_str);

				snprintf(response, sizeof(response), "{\"id\":%d, \"status\":\"ok\"}", id);
				respond_str(req, response);
			} else {
				snprintf(response, sizeof(response),
					"{\"id\":%d,\"status\":\"error\",\"message\":\"unknown action\"}", id);
				respond_str(req, response);
				smart_reamer_ex_log_err(TAG, "Unknown action: %s", action);
			}

		} else if (ws_pkt.type == HTTPD_WS_TYPE_PING) {
			ws_pkt.type = HTTPD_WS_TYPE_PONG;
		} else if (ws_pkt.type == HTTPD_WS_TYPE_CLOSE) {
			ws_pkt.len     = 0;
			ws_pkt.payload = NULL;
		}
		free(buf);
		return ret;
	}
	free(buf);
	return ESP_OK;
}

esp_err_t wss_open_fd(httpd_handle_t hd, int sockfd) {
	ESP_LOGI(TAG, "New client connected %d", sockfd);
	return ESP_OK;
}

void wss_close_fd(httpd_handle_t hd, int sockfd) {
	ESP_LOGI(TAG, "Client disconnected %d", sockfd);
	close(sockfd);
}

static const httpd_uri_t websocket = {
	.uri                      = "/ws",
	.method                   = HTTP_GET,
	.handler                  = ws_handler,
	.user_ctx                 = NULL,
	.is_websocket             = true,
	.handle_ws_control_frames = true
};

httpd_uri_t wss_server_start(httpd_handle_t* server) {
	return websocket;
}
