#pragma once

#include <esp_https_server.h>
#include <stdbool.h>

httpd_uri_t wss_server_start(httpd_handle_t* server);

void ws_set_server_handle(httpd_handle_t server);
void ws_broadcast_lock_status(bool is_locked);
bool ws_get_lock_state(void);
void ws_init_lock_state(void);
