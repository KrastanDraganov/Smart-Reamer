#include "motor.h"
#include "measure.h"
#include "ext_api.h"

Motor::Motor() {}

void Motor::begin() {
	smart_reamer_ex_motor_init();
	this->load_position();
	this->load_state();
}

void Motor::update() {
	smart_reamer_ex_motor_run();

	int32_t new_position = (int32_t)smart_reamer_ex_motor_current_position();
	if (new_position != this->current_position) {
		this->current_position = new_position;
		this->save_position();
	}

	if (this->current_state == MotorState::Moving) {
		if (this->current_position == this->target_position) {
			if (this->target_position == POSITION_OPEN) {
				this->current_state = MotorState::Opened;
			} else if (this->target_position == POSITION_CLOSED) {
				this->current_state = MotorState::Closed;
			}
			this->save_state();
		}
	}
}

void Motor::do_measure(Measure* m) {
	m->m_int(InstanceLabel::main, MeasureLabel::motor_position, this->current_position);
	m->m_int(InstanceLabel::main, MeasureLabel::motor_target_position, this->target_position);
	m->m_int(InstanceLabel::main, MeasureLabel::motor_state, (int)this->current_state);
}

void Motor::open() {
	this->move_to(POSITION_OPEN);
}

void Motor::close() {
	this->move_to(POSITION_CLOSED);
}

void Motor::move_to(int32_t target) {
	this->target_position = target;
	this->current_state = MotorState::Moving;
	smart_reamer_ex_motor_go_to_steps(target);
}

void Motor::save_position() {
	smart_reamer_ex_nvs_write_u32(NVS_KEY_POSITION, (uint32_t)this->current_position);
}

void Motor::load_position() {
	uint32_t value = 0;
	smart_reamer_ex_nvs_read_u32(NVS_KEY_POSITION, &value);
	this->current_position = (int32_t)value;
	smart_reamer_ex_motor_go_to_steps(this->current_position);
}

void Motor::save_state() {
	smart_reamer_ex_nvs_write_u32(NVS_KEY_STATE, (uint32_t)this->current_state);
}

void Motor::load_state() {
	uint32_t value = 0;
	smart_reamer_ex_nvs_read_u32(NVS_KEY_STATE, &value);
	this->current_state = (MotorState)value;
}
