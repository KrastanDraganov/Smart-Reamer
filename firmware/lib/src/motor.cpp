#include "motor.h"
#include "measure.h"
#include "ext_api.h"

static constexpr uint32_t WAIT_DURATION_MS = 500;

Motor::Motor() {}

void Motor::begin() {
	smart_reamer_ex_motor_init();
	this->load_position();
	this->load_state();

	smart_reamer_ex_motor_set_current_position(this->current_position);

	if (this->current_position >= POSITION_CLOSED) {
		this->target_position = POSITION_OPEN;
		this->current_state = MotorState::GoToOpen;
	} else {
		this->target_position = POSITION_CLOSED;
		this->current_state = MotorState::GoToClose;
	}
	this->save_state();
}

void Motor::update() {
	smart_reamer_ex_motor_run();

	int32_t new_position = (int32_t)smart_reamer_ex_motor_current_position();
	if (new_position != this->current_position) {
		this->current_position = new_position;
	}

	switch (this->current_state) {
	case MotorState::Idle:
		break;

	case MotorState::GoToClose:
		if (this->current_position >= POSITION_CLOSED) {
			this->current_state = MotorState::WaitToClose;
			this->wait_start_time = smart_reamer_ex_get_time_ms();
		} else {
			smart_reamer_ex_motor_go_to_steps(POSITION_CLOSED);
		}
		break;

	case MotorState::WaitToClose:
		if ((smart_reamer_ex_get_time_ms() - this->wait_start_time) >= WAIT_DURATION_MS) {
			this->current_state = MotorState::GoToOpen;
			this->target_position = POSITION_OPEN;
			this->save_position();
		}
		break;

	case MotorState::GoToOpen:
		if (this->current_position <= POSITION_OPEN) {
			this->current_state = MotorState::WaitToOpen;
			this->wait_start_time = smart_reamer_ex_get_time_ms();
		} else {
			smart_reamer_ex_motor_go_to_steps(POSITION_OPEN);
		}
		break;

	case MotorState::WaitToOpen:
		if ((smart_reamer_ex_get_time_ms() - this->wait_start_time) >= WAIT_DURATION_MS) {
			this->current_state = MotorState::Idle;
			this->save_position();
		}
		break;
	}
}

void Motor::do_measure(Measure* m) {
	m->m_int(InstanceLabel::main, MeasureLabel::motor_position, this->current_position);
	m->m_int(InstanceLabel::main, MeasureLabel::motor_target_position, this->target_position);
	m->m_int(InstanceLabel::main, MeasureLabel::motor_state, (int)this->current_state);
}

void Motor::open() {
	this->target_position = POSITION_OPEN;
	this->current_state = MotorState::GoToOpen;
	this->save_state();
}

void Motor::close() {
	this->target_position = POSITION_CLOSED;
	this->current_state = MotorState::GoToClose;
	this->save_state();
}

void Motor::move_to(int32_t target) {
	this->target_position = target;
	if (target <= POSITION_OPEN) {
		this->current_state = MotorState::GoToOpen;
	} else {
		this->current_state = MotorState::GoToClose;
	}
	smart_reamer_ex_motor_go_to_steps(target);
}

void Motor::save_position() {
	smart_reamer_ex_nvs_write_u32(NVS_KEY_POSITION, (uint32_t)this->current_position);
}

void Motor::load_position() {
	uint32_t value = 0;
	smart_reamer_ex_nvs_read_u32(NVS_KEY_POSITION, &value);
	this->current_position = (int32_t)value;
}

void Motor::save_state() {
	smart_reamer_ex_nvs_write_u32(NVS_KEY_STATE, (uint32_t)this->current_state);
}

void Motor::load_state() {
	uint32_t value = 0;
	smart_reamer_ex_nvs_read_u32(NVS_KEY_STATE, &value);
	this->current_state = (MotorState)value;
}

void Motor::set_idle() {
	this->current_state = MotorState::Idle;
	this->save_state();
}