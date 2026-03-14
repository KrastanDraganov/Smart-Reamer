#include "params.h"

Params::Params() {}

void Params::update() {
}

void Params::log() {
	// const char* TAG = "PARAMS";
	// smart_reamer_ex_log_info(TAG, "MANUAL_STEER_SPEED_REVPS: %.6f", this->manual_steer_speed_revps);
}

void Params::do_measure(Measure* m) {
	(void)m;
	// m->m_float(InstanceLabel::main, MeasureLabel::config_manual_steer_speed_revps, this->manual_steer_speed_revps);
}

void Params::edit(const char* name, const char* value_str) {
	(void)name; (void)value_str;
	// if (!strcmp(name, "main/config_manual_steer_speed_revps")) {
	// 	float v = std::fabs(atof(value_str));
	// 	if (v > MAX_STEER_SPEED_REVPS) {
	// 		return;
	// 	}
	// } else {
	// 	smart_reamer_ex_log_err("PARAMS", "Invalid config option name: %s", name);
	// }
}
