#include "button.h"
#include "ext_api.h"
#include "clock.h"

extern Clock clock;

Button::Button(uint8_t _pin, std::function<void(bool)> _callback)
	: pin(_pin), callback(_callback) {}

void Button::begin() {
	smart_reamer_ex_gpio_init_input(this->pin);
}

void Button::update() {
	bool current_state = smart_reamer_ex_gpio_read(this->pin);
	uint32_t now       = clock.now_u32();

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
