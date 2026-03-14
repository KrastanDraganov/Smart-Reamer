#include "clock.h"

#include "measure.h"

uint64_t Clock::now_u64() {
	return this->now;
}

uint32_t Clock::now_u32() {
	return (uint32_t)this->now;
}

void Clock::update(uint64_t t) {
	this->dt  = t - this->now;
	this->now = t;
}

void Clock::do_measure(Measure* m) {
	m->m_float(InstanceLabel::main, MeasureLabel::time_now, (float)this->now * 1e-6);
	m->m_float(InstanceLabel::main, MeasureLabel::main_loop_duration, (float)this->dt * 1e-6);
}
