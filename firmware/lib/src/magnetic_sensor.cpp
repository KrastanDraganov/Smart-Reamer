#include "magnetic_sensor.h"
#include "measure.h"
#include "ext_api.h"
#include "gpio_mapping.h"

MagneticSensor::MagneticSensor() {}

void MagneticSensor::begin() {
	smart_reamer_ex_gpio_init_input_pullup(MAGNET_SENSOR);
	smart_reamer_ex_gpio_init_output(MAGNET_SENSOR_LED);
	this->active = smart_reamer_ex_gpio_read(MAGNET_SENSOR);
	smart_reamer_ex_gpio_write(MAGNET_SENSOR_LED, this->active);
}

void MagneticSensor::update() {
	bool new_state = smart_reamer_ex_gpio_read(MAGNET_SENSOR);
	if (new_state != this->active) {
		this->active = new_state;
		smart_reamer_ex_gpio_write(MAGNET_SENSOR_LED, this->active);
		if (this->active) {
			smart_reamer_ex_log_info("MAG_SENSOR", "Magnetic sensor ACTIVE");
		}
	}
}

void MagneticSensor::do_measure(Measure* m) {
	m->m_bool(InstanceLabel::main, MeasureLabel::magnetic_sensor_active, this->active);
}
