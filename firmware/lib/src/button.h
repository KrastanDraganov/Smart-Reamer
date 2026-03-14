#pragma once

#include <cstdint>
#include <functional>

class Button {
	public:
		static constexpr uint32_t DEBOUNCE_DELAY_MS = 50;

		Button(uint8_t pin, std::function<void(bool)> callback);

		void begin();
		void update();

		bool is_pressed() const { return pressed; }

	private:
		uint8_t pin;
		bool    pressed      = false;
		bool    last_state   = false;
		uint32_t last_change = 0;
		std::function<void(bool)> callback;
};