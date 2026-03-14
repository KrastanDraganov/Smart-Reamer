#pragma once

#include <esp_https_server.h>

httpd_handle_t start_webserver(void);
void           stop_webserver(httpd_handle_t server);
