#include "app.h"
#include "clock.h"
#include "config.h"
#include "params.h"
#include "ext_api.h"
#include "measure.h"
#include "gpio_mapping.h"
#include "error_tracker.h"

#include <cstring>

Params          params;
Clock           clock;
Measure         measure(clock);
ErrorTracker    error_tracker(measure);

Measureable* measureables[] = {
	&params,
	&clock,
	&error_tracker,
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

void smart_reamer_main_loop_begin() {
	measure.set_measureables(measureables);
	measure.begin();
	error_tracker.begin();
}

void smart_reamer_main_loop_body() {
	measure.update();
	params.update();
	error_tracker.update();
}
