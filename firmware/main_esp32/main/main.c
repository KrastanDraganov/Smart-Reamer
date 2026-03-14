#include <esp_wifi.h>
#include <esp_event.h>
#include <esp_log.h>
#include <esp_system.h>
#include <nvs_flash.h>
#include <sys/param.h>
#include <esp_timer.h>
#include <esp_task_wdt.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

#include "wifi.h"
#include "websocket.h"
#include "ext_api.h"
#include "app.h"

#define PARKING_PLATFORM_MAIN_LOOP_STACK_SIZE (8 * 1024)
#define PARKING_PLATFORM_MAIN_LOOP_PRIORITY   10
// pin the main loop to the second core, which does nothing else
#define PARKING_PLATFORM_MAIN_LOOP_CORE_ID    1

void smart_reamer_main_loop(void* arg) {
	ESP_LOGI("main_loop", "parking platform main loop starting on core %d", xPortGetCoreID());

	// delete the watchdog subscription for the idle task for this core, since we
	// will use the core exclusively and the idle task will never run
	esp_task_wdt_delete(xTaskGetIdleTaskHandleForCore(PARKING_PLATFORM_MAIN_LOOP_CORE_ID));

	// add *this* task to the WDT instead
	esp_task_wdt_add(NULL);

	smart_reamer_main_loop_begin();
	while (true) {
		smart_reamer_update_time(esp_timer_get_time());
		smart_reamer_main_loop_body();
		esp_task_wdt_reset();
	}
}

void app_main(void) {
	ESP_ERROR_CHECK(nvs_flash_init());

	ws_init_lock_state();

	if (!wifi_init_sta()) {
		wifi_init_softap();
	}

	xTaskCreatePinnedToCore(
		smart_reamer_main_loop,
		"smart_reamer_main_loop",
		PARKING_PLATFORM_MAIN_LOOP_STACK_SIZE,
		NULL,
		PARKING_PLATFORM_MAIN_LOOP_PRIORITY,
		NULL,
		PARKING_PLATFORM_MAIN_LOOP_CORE_ID
	);

	while (true) {
		vTaskDelay(1000);
	}
}
