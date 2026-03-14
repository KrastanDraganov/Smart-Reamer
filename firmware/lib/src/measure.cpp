#include "measure.h"

#include <cmath>
#include <cstring>

#include "config.h"

#include "ext_api.h"

Measure::Measure(Clock& _clk) :
	clk(&_clk) {
	memset(this->enable_mask, 0, sizeof(this->enable_mask));
}

void Measure::begin() {
	this->last_perform = this->clk->now_u32();
}

void Measure::update() {
	if (!this->measureables) {
		return;
	}

	if (this->clk->now_u32() - this->last_perform > MEASURE_UPDATE_TIME) {
		this->last_perform = this->clk->now_u32();
		this->perform();
	}
}

// call this function if updating just this object in a blocking loop
void Measure::standalone_update() {
	if (!this->measureables) {
		return;
	}
	this->perform();
}

void Measure::perform() {
	if (this->locked) {
		return;
	}

	this->cur_json_out_w().reset();
	this->first_label = true;

	if (this->doing_oneshot) {
		this->cur_json_out_w().write_null_terminated("\"measurements_oneshot\":{");
	} else {
		this->cur_json_out_w().write_null_terminated("\"measurements\":{");
	}

	for (uint8_t i = 0; this->measureables[i] != nullptr; i++) {
		this->measureables[i]->do_measure(this);
	}

	this->cur_json_out_w().write_null_terminated("}");

	if (this->doing_oneshot) {
		this->doing_oneshot = false;
	}

	this->cur_json_out_idx_r = (this->cur_json_out_idx_r + 1) % 2;
}

void Measure::m_float(InstanceLabel il, MeasureLabel ml, float f) {
	if (!this->enabled(il, ml) && !this->doing_oneshot) {
		return;
	}

	this->print_label(il, ml);
	this->json_write(f);
}

void Measure::m_string(InstanceLabel il, MeasureLabel ml, const char* s) {
	if (!this->enabled(il, ml) && !this->doing_oneshot) {
		return;
	}

	this->print_label(il, ml);

	this->json_write("\"");
	this->json_write(s);
	this->json_write("\"");
}

void Measure::m_bin_2bytes(InstanceLabel il, MeasureLabel ml, uint16_t v) {
	if (!this->enabled(il, ml) && !this->doing_oneshot) {
		return;
	}

	this->print_label(il, ml);

	this->json_write("\"");
	this->json_write("0b");
	for (int8_t i = 15; i >= 0; i--) {
		if (v & (1 << i)) {
			this->json_write("1");
		} else {
			this->json_write("0");
		}
	}
	this->json_write("\"");
}

void Measure::m_bin_8bytes(InstanceLabel il, MeasureLabel ml, uint64_t v) {
	if (!this->enabled(il, ml) && !this->doing_oneshot) {
		return;
	}

	this->print_label(il, ml);

	this->json_write("\"");
	this->json_write("0b");
	for (int8_t i = 63; i >= 0; i--) {
		if (v & (1 << i)) {
			this->json_write("1");
		} else {
			this->json_write("0");
		}
	}
	this->json_write("\"");
}

void Measure::m_int(InstanceLabel il, MeasureLabel ml, int i) {
	if (!this->enabled(il, ml) && !this->doing_oneshot) {
		return;
	}

	this->print_label(il, ml);
	this->json_write(i);
}

void Measure::m_bool(InstanceLabel il, MeasureLabel ml, bool b) {
	if (!this->enabled(il, ml) && !this->doing_oneshot) {
		return;
	}

	this->print_label(il, ml);
	this->json_write((int)b);
}

void Measure::print_label(InstanceLabel il, MeasureLabel ml) {
	if (this->first_label) {
		this->first_label = false;
	} else {
		this->json_write(", ");
	}

	this->json_write("\"");
	this->json_write(this->instance_label_str(il));
	this->json_write("/");
	this->json_write(this->measure_label_str(ml));
	this->json_write("\": ");
}

bool Measure::enabled(InstanceLabel il, MeasureLabel ml) {
	size_t  il_idx      = (size_t)il;
	size_t  ml_byte_idx = ((size_t)ml) >> 3;
	uint8_t ml_bit_idx  = (uint8_t)ml & 0b111;
	return this->enable_mask[il_idx][ml_byte_idx] & (1 << ml_bit_idx);
}

bool Measure::exists(InstanceLabel il, MeasureLabel ml) {
	size_t  il_idx      = (size_t)il;
	size_t  ml_byte_idx = ((size_t)ml) >> 3;
	uint8_t ml_bit_idx  = (uint8_t)ml & 0b111;
	return this->exists_mask[il_idx][ml_byte_idx] & (1 << ml_bit_idx);
}

void Measure::set_exists(InstanceLabel il, MeasureLabel ml) {
	size_t  il_idx      = (size_t)il;
	size_t  ml_byte_idx = ((size_t)ml) >> 3;
	uint8_t ml_bit_idx  = (uint8_t)ml & 0b111;
	this->exists_mask[il_idx][ml_byte_idx] |= (1 << ml_bit_idx);
}

void Measure::set_enabled(InstanceLabel il, MeasureLabel ml, bool state) {
	size_t  il_idx      = (size_t)il;
	size_t  ml_byte_idx = ((size_t)ml) >> 3;
	uint8_t ml_bit_idx  = (uint8_t)ml & 0b111;
	if (state) {
		this->enable_mask[il_idx][ml_byte_idx] |= (1 << ml_bit_idx);
	} else {
		this->enable_mask[il_idx][ml_byte_idx] &= ~(1 << ml_bit_idx);
	}
}

void Measure::clear() {
	memset(this->enable_mask, 0, sizeof(this->enable_mask));
}

bool Measure::set_enabled_by_str(char* name, bool state) {
	char* suffix;
	for (suffix = name; *suffix != '/'; suffix++) {
		if (*suffix == '\0') {
			return false;
		}
	}
	*suffix = '\0';
	suffix++;
	char* prefix = name;

	size_t        found = 0;
	InstanceLabel il    = InstanceLabel::MAX;
	MeasureLabel  ml    = MeasureLabel::MAX;
	for (InstanceLabel i = (InstanceLabel)0; i < InstanceLabel::MAX; i = (InstanceLabel)((size_t)i + 1)) {
		if (strcmp(this->instance_label_str(i), prefix) == 0) {
			found++;
			il = i;
		}
	}

	for (MeasureLabel i = (MeasureLabel)0; i < MeasureLabel::MAX; i = (MeasureLabel)((size_t)i + 1)) {
		if (strcmp(this->measure_label_str(i), suffix) == 0) {
			found++;
			ml = i;
		}
	}

	if (found > 2) {
		return false;
	}

	if (found < 2) {
		return false;
	}

	this->set_enabled(il, ml, state);
	return true;
}

void Measure::do_oneshot() {
	this->doing_oneshot = 1;
}

void Measure::set_measureables(Measureable* _measureables[]) {
	this->measureables = _measureables;
}

void return_ok(Writer& w) {
	w.write_null_terminated("\"ok\"");
}

char* Measure::get_json() {
	this->locked = true;
	return this->cur_json_out_r().buf;
}

void Measure::finished_using_json() {
	this->locked = false;
}
