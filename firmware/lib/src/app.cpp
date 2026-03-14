#include "app.h"
#include "clock.h"
#include "config.h"
#include "params.h"
#include "ext_api.h"
#include "measure.h"
#include "gpio_mapping.h"
#include "error_tracker.h"
#include "motor.h"
#include "button.h"
#include "magnetic_sensor.h"

#include <cstring>

bool pair_mode         = false;
bool unlock_request    = false;

void on_unlock_button(bool pressed) {
	if (pressed) {
		unlock_request = true;
	}
	smart_reamer_ex_log_info("BUTTON", "Unlock button: %s", pressed ? "pressed" : "released");
}

void on_pair_button(bool pressed) {
	pair_mode = pressed;
	smart_reamer_ex_log_info("BUTTON", "Pair button: %s", pressed ? "ON" : "OFF");
}

Button button_unlock(BUTTON_UNLOCK, on_unlock_button);
Button button_pair(BUTTON_PAIR, on_pair_button);
MagneticSensor magnetic_sensor;

Params          params;
Clock           clock;
Measure         measure(clock);
ErrorTracker    error_tracker(measure);
Motor			motor;

Measureable* measureables[] = {
	&params,
	&clock,
	&error_tracker,
	&motor,
	&magnetic_sensor,
	nullptr
};

const char* tag = "APP";

void smart_reamer_update_time(uint64_t t) {
	clock.update(t);
}

bool smart_reamer_measure_enable_val(char* name) {
	return measure.set_enabled_by_str(name, true);
}

char* smart_reamer_measure_get_json() {
	return measure.get_json();
}

char* smart_reamer_measure_get_oneshot() {
	measure.do_oneshot();
	measure.perform();
	return measure.get_json();
}

void smart_reamer_measure_finished_using_json() {
	return measure.finished_using_json();
}

void smart_reamer_edit_config(const char* name, const char* value_str) {
	params.edit(name, value_str);
}

bool smart_reamer_is_locked(void) {
	// Delegate to the magnetic sensor, which is updated in the main loop.
	return magnetic_sensor.is_locked();
}

bool smart_reamer_is_pair_mode(void) {
	return pair_mode;
}

bool smart_reamer_get_unlock_request(void) {
	if (unlock_request) {
		unlock_request = false;
		return true;
	}
	return false;
}

void smart_reamer_main_loop_begin() {
	measure.set_measureables(measureables);
	measure.begin();
	error_tracker.begin();

	motor.begin();

	button_unlock.begin();
	button_pair.begin();

	magnetic_sensor.begin();
}

void smart_reamer_main_loop_body() {
	measure.update();
	params.update();
	error_tracker.update();

	motor.update();

	button_unlock.update();
	button_pair.update();

	magnetic_sensor.update();
}
