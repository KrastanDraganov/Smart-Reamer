#include "button.h"
#include "ext_api.h"
#include "clock.h"

Button::Button(uint8_t _pin, Callback _callback, Clock& clk)
	: pin(_pin), callback(_callback), clock(&clk) {}

void Button::begin() {
	smart_reamer_ex_gpio_init_input(this->pin);

	bool current_state = smart_reamer_ex_gpio_read(this->pin);
	uint32_t now       = this->clock->now_u32();

	this->last_state  = current_state;
	this->pressed     = current_state;
	this->last_change = now;
}

void Button::update() {
	bool current_state = smart_reamer_ex_gpio_read(this->pin);
	uint32_t now       = this->clock->now_u32() / 1000; // convert microseconds to milliseconds

	if (current_state != this->last_state) {
		this->last_change = now;
	}

	if (now - this->last_change > DEBOUNCE_DELAY_MS) {
		if (current_state != this->pressed) {
			this->pressed = current_state;
			if (this->callback) {
				this->callback(this->pressed);
			}
		}
	}

	this->last_state = current_state;
}
