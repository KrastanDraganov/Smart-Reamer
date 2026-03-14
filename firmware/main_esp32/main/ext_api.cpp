#include "ext_api.h"
#include "hal/uart_types.h"
#include "gpio_mapping.h"
#include "stepper_motor.h"
#include <esp_log.h>
#include <esp_timer.h>
#include <nvs_flash.h>
#include <esp_task_wdt.h>
#include <stdio.h>
#include <cstdarg>
#include <cstring>
#include "freertos/FreeRTOS.h"

#include <driver/uart.h>
#include <driver/gpio.h>

#define NVS_TAG          "nvs"

#define UART_BUFFER_SIZE 255

// Read packet timeout
#define PACKET_READ_TICS (100 / portTICK_PERIOD_MS)

void smart_reamer_ex_log_info(const char* tag, const char* format, ...) {
	char    buf[1024];
	va_list list;
	va_start(list, format);
	vsnprintf(buf, sizeof(buf), format, list);
	va_end(list);
	ESP_LOGI(tag, "%s", buf);
}

void smart_reamer_ex_log_err(const char* tag, const char* format, ...) {
	char    buf[1024];
	va_list list;
	va_start(list, format);
	vsnprintf(buf, sizeof(buf), format, list);
	va_end(list);
	ESP_LOGE(tag, "%s", buf);
}

void smart_reamer_ex_blocking_delay(uint32_t ms) {
	vTaskDelay(ms / portTICK_PERIOD_MS);
}

void smart_reamer_ex_modbus_uart_begin(uint8_t uart_number, uint32_t baudrate, uint8_t tx_pin, uint8_t rx_pin, uint8_t de_pin) {
	uart_port_t port = (uart_port_t)uart_number;
	uart_driver_install(port, UART_BUFFER_SIZE, UART_BUFFER_SIZE, 0, NULL, ESP_INTR_FLAG_IRAM);

	uart_config_t config;
	memset(&config, 0, sizeof(config));
	config.baud_rate = (int)baudrate;
	config.data_bits = UART_DATA_8_BITS;
	config.parity = UART_PARITY_DISABLE;
	config.stop_bits = UART_STOP_BITS_1;
	config.flow_ctrl = UART_HW_FLOWCTRL_DISABLE;
	config.rx_flow_ctrl_thresh = 122;
	config.source_clk = UART_SCLK_DEFAULT;

	uart_param_config(port, &config);

	uart_set_pin(port, tx_pin, rx_pin, de_pin, UART_PIN_NO_CHANGE);

	uart_set_mode(port, UART_MODE_RS485_HALF_DUPLEX);
}

int smart_reamer_ex_uart_available(uint8_t uart_number) {
	uart_port_t port = (uart_port_t)uart_number;
	size_t    len;
	esp_err_t err = uart_get_buffered_data_len(port, &len);
	if (err != ESP_OK) {
		ESP_LOGE("uart", "could not read from uart %u: %d", uart_number, err);
		return 0;
	}
	return len;
}

int smart_reamer_ex_uart_read(uint8_t uart_number) {
	uart_port_t port = (uart_port_t)uart_number;
	uint8_t byte;
	size_t  len     = smart_reamer_ex_uart_available(uart_number);
	int     new_len = len;
	if (len > 0) {
		new_len = uart_read_bytes(port, &byte, 1, 0);
	}
	return (new_len > 0) ? byte : -1;
}

int smart_reamer_ex_uart_peek(uint8_t uart_number) {
	return smart_reamer_ex_uart_read(uart_number);
}

int smart_reamer_ex_uart_write(uint8_t uart_number, uint8_t* buffer, uint8_t size) {
	uart_port_t port = (uart_port_t)uart_number;
	return uart_write_bytes(port, (const char*)buffer, size);
}

void smart_reamer_ex_uart_flush(uint8_t uart_number) {
	uart_port_t port = (uart_port_t)uart_number;
	uart_wait_tx_done(port, 10);
}

void smart_reamer_ex_nvs_write_u32(const char* key, uint32_t value) {
	nvs_handle_t my_handle;
	esp_err_t    err = nvs_open("storage", NVS_READWRITE, &my_handle);
	if (err != ESP_OK) {
		ESP_LOGE(NVS_TAG, "Error (%s) opening NVS handle!", esp_err_to_name(err));
		return;
	}

	err = nvs_set_u32(my_handle, key, value);
	if (err != ESP_OK) {
		ESP_LOGE(NVS_TAG, "Error (%s) Failed to write value %f!", esp_err_to_name(err), (float)value);
	}

	err = nvs_commit(my_handle);
	if (err != ESP_OK) {
		ESP_LOGE(NVS_TAG, "Failed to commit NVS changes!");
	}

	nvs_close(my_handle);
}

void smart_reamer_ex_nvs_read_u32(const char* key, uint32_t* value) {
	nvs_handle_t my_handle;
	esp_err_t    err = nvs_open("storage", NVS_READWRITE, &my_handle);
	if (err != ESP_OK) {
		ESP_LOGE(NVS_TAG, "Error (%s) opening NVS handle!", esp_err_to_name(err));
		return;
	}

	err = nvs_get_u32(my_handle, key, value);
	if (err != ESP_OK) {
		switch (err) {
		case ESP_ERR_NVS_NOT_FOUND:
			ESP_LOGW(NVS_TAG, "The value is not initialized yet!");
			*value = 0;
			break;
		default:
			ESP_LOGE(NVS_TAG, "Error (%s) reading!", err);
		}
	}

	nvs_close(my_handle);
}

static stepper_motor motor_stepper(
	stepper_motor::DRIVER,
	MOTOR_STEP_PIN,
	MOTOR_DIR_PIN,
	0, 0,
	false
);

extern "C" {

void smart_reamer_ex_motor_init() {
	motor_stepper.setEnablePin(MOTOR_ENABLE_PIN);
	motor_stepper.setPinsInverted(false, false, MOTOR_ENABLE_INVERTED);
	motor_stepper.enableOutputs();
	motor_stepper.setMaxSpeed(MOTOR_MAX_SPEED);
	motor_stepper.setAcceleration(MOTOR_ACCELERATION);
}

void smart_reamer_ex_motor_run() {
	motor_stepper.run();
}

long smart_reamer_ex_motor_current_position() {
	return motor_stepper.currentPosition();
}

void smart_reamer_ex_motor_go_to_steps(long position) {
	motor_stepper.moveTo(position);
}

void smart_reamer_ex_motor_set_current_position(long position) {
	motor_stepper.setCurrentPosition(position);
}

void smart_reamer_ex_gpio_init_input(uint8_t pin) {
	gpio_reset_pin((gpio_num_t)pin);
	gpio_set_direction((gpio_num_t)pin, GPIO_MODE_INPUT);
	gpio_set_pull_mode((gpio_num_t)pin, GPIO_FLOATING);
}

void smart_reamer_ex_gpio_init_input_pullup(uint8_t pin) {
	gpio_reset_pin((gpio_num_t)pin);
	gpio_set_direction((gpio_num_t)pin, GPIO_MODE_INPUT);
	gpio_set_pull_mode((gpio_num_t)pin, GPIO_PULLUP_ONLY);
}

bool smart_reamer_ex_gpio_read(uint8_t pin) {
	return gpio_get_level((gpio_num_t)pin) == 1;
}

void smart_reamer_ex_gpio_init_output(uint8_t pin) {
	gpio_reset_pin((gpio_num_t)pin);
	gpio_set_direction((gpio_num_t)pin, GPIO_MODE_OUTPUT);
}

void smart_reamer_ex_gpio_write(uint8_t pin, bool high) {
	gpio_set_level((gpio_num_t)pin, high ? 1 : 0);
}

}
