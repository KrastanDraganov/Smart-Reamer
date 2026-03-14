#pragma once

#include "measureable.h"
#include <cstdint>

class MagneticSensor : public Measureable {
	public:
		static constexpr const char* NVS_KEY_ACTIVE = "mag_active";

		MagneticSensor();

		void begin();
		void update();
		void do_measure(Measure* m);

		bool is_active() const { return active; }

	private:
		bool active = false;
};