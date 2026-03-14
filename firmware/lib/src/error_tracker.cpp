#include "error_tracker.h"
#include "config.h"
#include "ext_api.h"

#include <cstring>
#include <cstdio>

ErrorTracker::ErrorTracker(Measure& _measure) :
	measure(&_measure)
{}

void ErrorTracker::begin() {
	this->error = ErrorCode::None;
}

void ErrorTracker::update() {
	while (this->hasError()) {
		this->print_error(this->error, this->code);
		this->measure->standalone_update();

		smart_reamer_ex_blocking_delay(1000);
	}
}

void ErrorTracker::do_measure(Measure* m) {
	m->m_string(InstanceLabel::main, MeasureLabel::error, this->error_msg);
}

void ErrorTracker::fill_error_msg(char* err_msg, ErrorCode err, uint64_t err_code) {
	const char* name;
	switch (err) {
	default:
		name = "Unknown Error";
		break;
	}

	const char* code_name;
	switch (err_code & 0xffff) {
	default:
		code_name = "UnknownErrorCode";
		break;
	}

	snprintf(err_msg, MAX_ERROR_MSG_BYTES, "Error: %s with code %llu (%s on addr %llu)", name, err_code & (((long long)1 << 32) - 1), code_name, (unsigned long long)err_code >> 32);
}

void ErrorTracker::log_error(ErrorCode err, uint64_t err_code) {
	char err_msg[MAX_ERROR_MSG_BYTES]{};
	this->fill_error_msg(err_msg, err, err_code);

	smart_reamer_ex_log_err("panic", err_msg);
}

void ErrorTracker::print_error(ErrorCode err, uint64_t err_code) {
	this->fill_error_msg(this->error_msg, err, err_code);

	smart_reamer_ex_log_err("panic", this->error_msg);
}

void ErrorTracker::fatal_error(ErrorCode _err, uint64_t _code) {
	this->error = _err;
	this->code  = _code;

	this->update();
}

bool ErrorTracker::hasError() {
	return this->error != ErrorCode::None;
}

void ErrorTracker::clearError() {
	this->error = ErrorCode::None;
}
