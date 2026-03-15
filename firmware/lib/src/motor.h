#pragma once

#include "measureable.h"
#include <cstdint>

enum class MotorState {
	Idle,
	GoToClose,
	WaitToClose,
	GoToOpen,
	WaitToOpen,
};

class Motor : public Measureable {
	public:
		static constexpr int32_t POSITION_OPEN   = 0;
		static constexpr int32_t POSITION_CLOSED = 800;
		static constexpr const char* NVS_KEY_POSITION  = "motor_pos";
		static constexpr const char* NVS_KEY_STATE     = "motor_state";

		Motor();

		void begin();
		void update();
		void do_measure(Measure* m);

		void open();
		void close();
		void set_idle();

		int32_t position() const { return this->current_position; }
		MotorState state() const { return this->current_state; }

	private:
		int32_t current_position = 0;
		MotorState current_state = MotorState::Idle;
		int32_t target_position  = 0;
		uint32_t wait_start_time = 0;

		void save_position();
		void load_position();
		void move_to(int32_t target);
};
