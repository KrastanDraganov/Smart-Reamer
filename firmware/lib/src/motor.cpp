#include "motor.h"
#include "measure.h"
#include "ext_api.h"

static constexpr uint32_t WAIT_DURATION_MS = 500;

Motor::Motor() {}

void Motor::begin() {
	smart_reamer_ex_motor_init();
	this->load_position();

	smart_reamer_ex_motor_set_current_position(this->current_position);

	if (this->current_position >= POSITION_CLOSED) {
		this->target_position = POSITION_CLOSED;
		if (this->current_position == POSITION_CLOSED) {
			this->current_state = MotorState::Idle;
		} else {
			this->current_state = MotorState::GoToClose;
		}
	} else if (this->current_position <= POSITION_OPEN) {
		this->target_position = POSITION_OPEN;
		if (this->current_position == POSITION_OPEN) {
			this->current_state = MotorState::Idle;
		} else {
			this->current_state = MotorState::GoToOpen;
		}
	} else {
		int32_t dist_to_open = this->current_position - POSITION_OPEN;
		int32_t dist_to_close = POSITION_CLOSED - this->current_position;
		if (dist_to_open < dist_to_close) {
			this->target_position = POSITION_OPEN;
			this->current_state = MotorState::GoToOpen;
		} else {
			this->target_position = POSITION_CLOSED;
			this->current_state = MotorState::GoToClose;
		}
	}
}

void Motor::update() {
	smart_reamer_ex_motor_run();

	int32_t new_position = (int32_t)smart_reamer_ex_motor_current_position();
	if (new_position != this->current_position) {
		this->current_position = new_position;
	}

	static MotorState last_state = MotorState::Idle;
	static bool motion_issued = false;

	if (this->current_state != last_state) {
		motion_issued = false;
		last_state = this->current_state;
	}

	switch (this->current_state) {
	case MotorState::Idle:
		break;

	case MotorState::GoToClose:
		if (!motion_issued) {
			smart_reamer_ex_motor_go_to_steps(this->target_position);
			motion_issued = true;
		}
		if (this->current_position >= POSITION_CLOSED) {
			this->current_state = MotorState::WaitToClose;
			this->wait_start_time = smart_reamer_ex_get_time_ms();
		}
		break;

	case MotorState::WaitToClose:
		if ((smart_reamer_ex_get_time_ms() - this->wait_start_time) >= WAIT_DURATION_MS) {
			this->current_state = MotorState::Idle;
			this->save_position();
		}
		break;

	case MotorState::GoToOpen:
		if (!motion_issued) {
			smart_reamer_ex_motor_go_to_steps(this->target_position);
			motion_issued = true;
		}
		if (this->current_position <= POSITION_OPEN) {
			this->current_state = MotorState::WaitToOpen;
			this->wait_start_time = smart_reamer_ex_get_time_ms();
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
}

void Motor::close() {
	this->target_position = POSITION_CLOSED;
	this->current_state = MotorState::GoToClose;
}

void Motor::move_to(int32_t target) {
	this->target_position = target;
	if (target <= POSITION_OPEN) {
		this->current_state = MotorState::GoToOpen;
	} else {
		this->current_state = MotorState::GoToClose;
	}
}

void Motor::save_position() {
	smart_reamer_ex_nvs_write_u32(NVS_KEY_POSITION, (uint32_t)this->current_position);
}

void Motor::load_position() {
	uint32_t value = 0;
	smart_reamer_ex_nvs_read_u32(NVS_KEY_POSITION, &value);
	this->current_position = (int32_t)value;
}

void Motor::set_idle() {
	this->current_state = MotorState::Idle;
}
