#pragma once

#include "config.h"
#include <stdint.h>

#include "measure.h"
#include "ext_api.h"

class Params : public Measureable {
	public:
		Params();

		void update();
		void edit(const char* name, const char* value_str);

		void log();
		void do_measure(Measure* m);
};
