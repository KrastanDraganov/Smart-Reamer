#pragma once

class Measure;

class Measureable {
	public:
		virtual void do_measure(Measure*) = 0;
};
