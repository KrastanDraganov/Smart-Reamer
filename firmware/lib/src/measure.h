#pragma once

#include <cstdint>
#include <cstddef>
#include "buf_writer.h"
#include "clock.h"
#include "measureable.h"

enum class InstanceLabel {
	main,
	MAX
};

enum class MeasureLabel {
	motor_position,
	motor_target_position,
	motor_state,

	magnetic_sensor_active,

	wifi_status,
	mqtt_status,

	time_now,
	main_loop_duration,
	error,

	MAX
};

class Measure {
	public:
		Measure(Clock&);
		void m_bool(InstanceLabel, MeasureLabel, bool);
		void m_float(InstanceLabel, MeasureLabel, float);
		void m_bin_2bytes(InstanceLabel, MeasureLabel, uint16_t);
		void m_bin_8bytes(InstanceLabel, MeasureLabel, uint64_t);
		void m_string(InstanceLabel, MeasureLabel, const char*);
		void m_int(InstanceLabel, MeasureLabel, int);

		void begin();
		void update();
		void standalone_update();

		bool enabled(InstanceLabel, MeasureLabel);
		bool exists(InstanceLabel, MeasureLabel);
		void set_enabled(InstanceLabel, MeasureLabel, bool);
		bool set_enabled_by_str(char*, bool);
		void clear();

		char* get_json();
		void  finished_using_json();

		void do_oneshot();

		// given array must end with a nullptr!
		void set_measureables(Measureable* arr[]);

		void perform();

	private:
		uint32_t last_perform  = 0;
		uint32_t now           = 0;
		bool     doing_oneshot = true;

		BufWriter<4096>  json_out[2];
		uint8_t          cur_json_out_idx_r = 0;
		BufWriter<4096>& cur_json_out_r() { return this->json_out[this->cur_json_out_idx_r]; };
		BufWriter<4096>& cur_json_out_w() { return this->json_out[(this->cur_json_out_idx_r + 1) % 2]; };
		void             json_write(const char* s) { this->cur_json_out_w().write_null_terminated(s); };
		void             json_write(float f) { this->cur_json_out_w().format_float(f, 6); };
		void             json_write(int i) { this->cur_json_out_w().format_int(i); };

		Measureable** measureables;

		Clock* clk;

		bool locked = false;
		bool first_label;

		void    set_exists(InstanceLabel, MeasureLabel);
		uint8_t exists_mask[(size_t)InstanceLabel::MAX][(((size_t)MeasureLabel::MAX - 1) >> 3) + 1] = {0};
		uint8_t enable_mask[(size_t)InstanceLabel::MAX][(((size_t)MeasureLabel::MAX - 1) >> 3) + 1] = {0};

		static inline const char* instance_label_str(InstanceLabel il) {
			switch (il) {
			case InstanceLabel::main:
				return "main";
			default:
				return "na";
			}
		};

		static inline const char* measure_label_str(MeasureLabel il) {
			switch (il) {
			case MeasureLabel::motor_position:
				return "motor_position";
			case MeasureLabel::motor_target_position:
				return "motor_target_position";
			case MeasureLabel::motor_state:
				return "motor_state";

			case MeasureLabel::magnetic_sensor_active:
				return "magnetic_sensor_active";

			case MeasureLabel::wifi_status:
				return "wifi_status";
			case MeasureLabel::mqtt_status:
				return "mqtt_status";

			case MeasureLabel::time_now:
				return "time_now";
			case MeasureLabel::main_loop_duration:
				return "main_loop_duration";
			case MeasureLabel::error:
				return "error";

			default:
				return "na";
			}
		};

		void print_label(InstanceLabel, MeasureLabel);
};
