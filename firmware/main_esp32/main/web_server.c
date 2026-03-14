#include <esp_wifi.h>
#include <esp_event.h>
#include <esp_log.h>
#include <esp_system.h>
#include <nvs_flash.h>
#include <sys/param.h>
#include "esp_netif.h"
#include "esp_eth.h"

#include <esp_https_server.h>
#include <esp_timer.h>
#include <esp_task_wdt.h>

#include <stdlib.h>
#include <string.h>

#include "config.h"
#include "websocket.h"
#include "app.h"
#include "ext_api.h"

static const char* TAG = "web_server";

bool get_req_body(httpd_req_t* req, char* buf, uint32_t buf_size) {
	int total_len = req->content_len;
	int received  = 0;
	int remaining = total_len;

	if (total_len >= buf_size - 1) {
		ESP_LOGI(TAG, "received a request that is too big");
		return false;
	}

	// Read the body in chunks
	while (remaining > 0) {
		int ret = httpd_req_recv(req, buf + received, remaining);
		if (ret <= 0) {
			// Error or client closed connection
			free(buf);
			if (ret == HTTPD_SOCK_ERR_TIMEOUT) {
				httpd_resp_send_408(req); // Request Timeout
			}
			ESP_LOGI(TAG, "died in the middle of receiving request body");
			return false;
		}
		received += ret;
		remaining -= ret;
	}

	buf[total_len] = '\0'; // Null-terminate the string
	return true;
}

/* An HTTP GET handler */
esp_err_t root_get_handler(httpd_req_t* req) {
	ESP_LOGI(TAG, "Handling root request");
	httpd_resp_send(req, "", 0);

	return ESP_OK;
}

esp_err_t measure_get_handler(httpd_req_t* req) {
	httpd_resp_set_type(req, "application/json");

	char* fragment = smart_reamer_measure_get_json();
	if (fragment == NULL) {
		httpd_resp_send_500(req);
		return ESP_FAIL;
	}

	size_t fragment_len = strlen(fragment);
	/* +2 for surrounding braces, +1 for null terminator */
	size_t total_len = fragment_len + 2;
	char* json = (char*)malloc(total_len + 1);
	if (json == NULL) {
		smart_reamer_measure_finished_using_json();
		httpd_resp_send_500(req);
		return ESP_FAIL;
	}

	json[0] = '{';
	memcpy(json + 1, fragment, fragment_len);
	json[total_len - 1] = '}';
	json[total_len] = '\0';

	httpd_resp_send(req, json, HTTPD_RESP_USE_STRLEN);

	free(json);
	smart_reamer_measure_finished_using_json();

	return ESP_OK;
}

esp_err_t measure_enable_handler(httpd_req_t* req) {
	httpd_resp_set_type(req, "application/json");
	char buf[256];
	if (!get_req_body(req, buf, sizeof(buf))) {
		return ESP_FAIL;
	}
	if (smart_reamer_measure_enable_val(buf)) {
		httpd_resp_send(req, "\"ok\"\n", HTTPD_RESP_USE_STRLEN);
		return ESP_OK;
	} else {
		httpd_resp_send(req, "\"fail\"\n", HTTPD_RESP_USE_STRLEN);
		return ESP_FAIL;
	}

	return ESP_OK;
}

const httpd_uri_t root = {
	.uri     = "/",
	.method  = HTTP_GET,
	.handler = root_get_handler
};

const httpd_uri_t measure_get = {
	.uri     = "/measure",
	.method  = HTTP_GET,
	.handler = measure_get_handler
};

const httpd_uri_t measure_enable = {
	.uri     = "/measure/enable",
	.method  = HTTP_POST,
	.handler = measure_enable_handler
};

httpd_handle_t start_webserver(void) {
	httpd_handle_t server;

	// Start the httpd server
	ESP_LOGI(TAG, "Starting server");

	httpd_uri_t ws = wss_server_start(&server);

	httpd_ssl_config_t conf = HTTPD_SSL_CONFIG_DEFAULT();

	extern const unsigned char servercert_start[] asm("_binary_servercert_pem_start");
	extern const unsigned char servercert_end[] asm("_binary_servercert_pem_end");
	conf.servercert     = servercert_start;
	conf.servercert_len = servercert_end - servercert_start;

	extern const unsigned char prvtkey_pem_start[] asm("_binary_prvtkey_pem_start");
	extern const unsigned char prvtkey_pem_end[] asm("_binary_prvtkey_pem_end");
	conf.prvtkey_pem = prvtkey_pem_start;
	conf.prvtkey_len = prvtkey_pem_end - prvtkey_pem_start;

	esp_err_t ret = httpd_ssl_start(&server, &conf);
	if (ESP_OK != ret) {
		ESP_LOGI(TAG, "Error starting server!");
		return NULL;
	}

	// Set URI handlers
	ESP_LOGI(TAG, "Registering URI handlers");
	httpd_register_uri_handler(server, &root);
	httpd_register_uri_handler(server, &ws);
	httpd_register_uri_handler(server, &measure_get);
	httpd_register_uri_handler(server, &measure_enable);

	ws_set_server_handle(server);

	return server;
}

void stop_webserver(httpd_handle_t server) {
	// Stop the httpd server
	httpd_ssl_stop(server);
}
