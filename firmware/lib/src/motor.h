#pragma once

#include "measureable.h"
#include <cstdint>

enum class MotorState {
	Closed,
	Opened,
	Moving,
};

class Motor : public Measureable {
	public:
		static constexpr int32_t POSITION_OPEN   = 3000;
		static constexpr int32_t POSITION_CLOSED  = 1000;
		static constexpr const char* NVS_KEY_POSITION  = "motor_pos";
		static constexpr const char* NVS_KEY_STATE     = "motor_state";

		Motor();

		void begin();
		void update();
		void do_measure(Measure* m);

		void open();
		void close();

		int32_t position() const { return this->current_position; }
		MotorState state() const { return this->current_state; }

	private:
		int32_t current_position = 0;
		MotorState current_state = MotorState::Closed;
		int32_t target_position  = 0;

		void save_position();
		void load_position();
		void save_state();
		void load_state();
		void move_to(int32_t target);
		void step();
};
