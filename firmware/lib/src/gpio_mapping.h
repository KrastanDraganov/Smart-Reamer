#pragma once

#include <stdint.h>

const uint8_t MOTOR_STEP_PIN  = 4;
const uint8_t MOTOR_DIR_PIN   = 16;
const uint8_t MOTOR_ENABLE_PIN = 2;

const uint8_t MOTOR_INTERFACE_TYPE = 1;
const bool MOTOR_ENABLE_INVERTED   = true;
const float MOTOR_MAX_SPEED        = 5000;
const float MOTOR_ACCELERATION     = 100;
const float MOTOR_SPEED            = 200;

const uint8_t BUTTON_UNLOCK = 17;
const uint8_t BUTTON_PAIR = 18;
