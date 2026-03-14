#include "mdns_service.h"
#include "config.h"
#include <mdns.h>
#include <esp_mac.h>
#include <esp_log.h>

static const char* TAG = "mdns_service";

void mdns_service_init(void) {
	esp_err_t err = mdns_init();
	if (err == ESP_ERR_INVALID_STATE) {
		ESP_LOGD(TAG, "mDNS already initialized, continuing to update service");
	} else if (err != ESP_OK) {
		ESP_LOGE(TAG, "mDNS init failed: %s", esp_err_to_name(err));
		return;
	}

	mdns_hostname_set("smartreamer");
	mdns_instance_name_set(CFG_WIFI_SSID);

	uint8_t mac[6];
	esp_read_mac(mac, ESP_MAC_WIFI_STA);
	char mac_str[18];
	snprintf(mac_str, sizeof(mac_str), "%02X:%02X:%02X:%02X:%02X:%02X",
		mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

	mdns_txt_item_t txt[] = {
		{ "mac", mac_str },
		{ "version", FIRMWARE_VERSION },
	};

	err = mdns_service_add(CFG_WIFI_SSID, "_smartlock", "_tcp", 443, txt, 2);
	if (err != ESP_OK) {
		ESP_LOGE(TAG, "mDNS service add failed: %s", esp_err_to_name(err));
		return;
	}

	ESP_LOGI(TAG, "mDNS service _smartlock._tcp. advertised on port 443 (mac=%s)", mac_str);
}
