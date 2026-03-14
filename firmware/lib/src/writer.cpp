#include "writer.h"
#include <cstdlib>

void Writer::format_float(float value, uint8_t precision) {
	char buf[20];

	char* ptr = buf;
	if (value < 0) {
		*ptr++ = '-';
		value  = -value;
	}

	int   int_part   = (int)value;
	float fractional = value - (float)int_part;

	// Convert integer part
	char int_buf[16];
	int  i = 0;
	if (int_part == 0) {
		int_buf[i++] = '0';
	} else {
		while (int_part > 0) {
			int_buf[i++] = '0' + (int_part % 10);
			int_part /= 10;
		}
	}

	// Reverse integer part into ptr
	for (int j = i - 1; j >= 0; j--) {
		*ptr++ = int_buf[j];
	}

	*ptr++ = '.';

	// Convert fractional part
	for (i = 0; i < precision; i++) {
		fractional *= 10.0f;
		int digit = (int)fractional;
		*ptr++    = '0' + digit;
		fractional -= digit;
	}

	*ptr = '\0';

	this->write_null_terminated(buf);
}

void Writer::format_int(int x) {
	char buf[20];
	itoa(x, buf, 10);
	this->write_null_terminated(buf);
}
