#include <esp_event.h>
#include <esp_log.h>
#include <esp_system.h>
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

static esp_err_t ws_handler(httpd_req_t* req) {
	if (req->method == HTTP_GET) {
		ESP_LOGI(TAG, "Handshake done, the new connection was opened");
		return ESP_OK;
	}
	httpd_ws_frame_t ws_pkt;
	uint8_t*         buf = NULL;
	memset(&ws_pkt, 0, sizeof(httpd_ws_frame_t));

	// First receive the full ws message
	/* Set max_len = 0 to get the frame len */
	esp_err_t ret = httpd_ws_recv_frame(req, &ws_pkt, 0);
	if (ret != ESP_OK) {
		ESP_LOGE(TAG, "httpd_ws_recv_frame failed to get frame len with %d", ret);
		return ret;
	}
	if (ws_pkt.len) {
		/* ws_pkt.len + 1 is for NULL termination as we are expecting a string */
		buf = calloc(1, ws_pkt.len + 1);
		if (buf == NULL) {
			ESP_LOGE(TAG, "Failed to calloc memory for buf");
			return ESP_ERR_NO_MEM;
		}
		ws_pkt.payload = buf;
		/* Set max_len = ws_pkt.len to get the frame payload */
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

			if (strcmp(action, "get_measurements") == 0) {
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
				smart_reamer_ex_log_err(TAG, "Unknown action: %s", action);
			}

		} else if (ws_pkt.type == HTTPD_WS_TYPE_PING) {
			// Response PONG packet to peer
			ws_pkt.type = HTTPD_WS_TYPE_PONG;
		} else if (ws_pkt.type == HTTPD_WS_TYPE_CLOSE) {
			// Response CLOSE packet with no payload to peer
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
