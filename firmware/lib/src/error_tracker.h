#pragma once

#include <cstdint>

#include "measure.h"
#include "config.h"

class ErrorTracker : public Measureable {
	public:
		enum ErrorCode {
			None,
		};

		ErrorTracker(Measure&);

		void begin();
		void update();
		void do_measure(Measure*);

		void fill_error_msg(char* err_msg, ErrorCode err, uint64_t err_code);
		void log_error(ErrorCode err, uint64_t err_code);
		void print_error(ErrorCode err, uint64_t code);
		void fatal_error(ErrorCode err, uint64_t code);
		bool hasError();
		void clearError();

	private:
		Measure*   measure;

		ErrorCode error = ErrorCode::None;
		uint64_t  code  = 0;

		char error_msg[MAX_ERROR_MSG_BYTES]{};
};
