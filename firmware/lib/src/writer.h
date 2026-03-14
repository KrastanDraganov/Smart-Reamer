#pragma once

#include <stdint.h>

class Writer {
	public:
		virtual void     write_null_terminated(const char* buf)   = 0;
		virtual void     write_raw(const char* buf, uint16_t len) = 0;
		virtual uint16_t size()                                   = 0;
		virtual bool     has_overflown()                          = 0;
		void             format_float(float val, uint8_t precision);
		void             format_int(int i);
};
