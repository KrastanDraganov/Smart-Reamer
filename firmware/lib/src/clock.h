#pragma once

#include "measureable.h"
#include <cstdint>

class Clock : public Measureable {
	public:
		uint64_t now_u64();
		uint32_t now_u32();

		void update(uint64_t time);
		void do_measure(Measure* m);

	private:
		uint64_t now = 0;
		uint32_t dt;
};
