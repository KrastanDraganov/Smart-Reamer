#pragma once

#include "writer.h"

template <uint16_t max_size>
class BufWriter : public Writer {
	public:
		BufWriter() {
			this->reset();
		};

		void write_null_terminated(const char* s) {
			this->write_to_buf(s, true, max_size);
		}

		void write_raw(const char* ext_buf, uint16_t len) {
			this->write_to_buf(ext_buf, false, len);
		}

		uint16_t size() {
			return this->idx;
		};

		bool has_overflown() {
			return this->idx == 0xffff;
		}

		void reset() {
			this->idx    = 0;
			this->buf[0] = '\0';
		}

		char buf[max_size];

	private:
		uint16_t idx;

		void write_to_buf(const char* ext_buf, bool null_terminated, uint16_t max_len) {
			if (this->idx == 0xffff) {
				return;
			}
			for (uint16_t i = 0; (!null_terminated || ext_buf[i] != '\0') && i < max_len; i++) {
				if (this->idx >= max_size - 1) {
					this->idx = 0xffff;
					return;
				}
				this->buf[this->idx] = ext_buf[i];
				this->idx++;
			}
			this->buf[this->idx] = '\0';
		}
};
