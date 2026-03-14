#pragma once

#include <cstdint>

class Button {
	public:
		using Callback = void(*)(bool);

		static constexpr uint32_t DEBOUNCE_DELAY_MS = 50;

		Button(uint8_t pin, Callback callback);

		void begin();
		void update();

		bool is_pressed() const { return pressed; }

	private:
		uint8_t pin;
		bool    pressed      = false;
		bool    last_state   = false;
		uint32_t last_change = 0;
		Callback callback;
};