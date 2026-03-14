#include "magnetic_sensor.h"
#include "measure.h"
#include "ext_api.h"
#include "gpio_mapping.h"

const uint8_t MAGNETIC_SENSOR_PIN = 19;

MagneticSensor::MagneticSensor() {}

void MagneticSensor::begin() {
	smart_reamer_ex_gpio_init_input_pullup(MAGNETIC_SENSOR_PIN);
	smart_reamer_ex_gpio_init_output(MAGNET_SENSOR_LED);
	this->active = smart_reamer_ex_gpio_read(MAGNETIC_SENSOR_PIN);
	smart_reamer_ex_gpio_write(MAGNET_SENSOR_LED, this->active);
}

void MagneticSensor::update() {
	bool new_state = smart_reamer_ex_gpio_read(MAGNETIC_SENSOR_PIN);
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
