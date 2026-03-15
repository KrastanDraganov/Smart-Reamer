#pragma once

#include "math.h"

// TODO: CHANGE SOME MS constants to US constants

// define when debugging
#define DEBUG

#define MEASURE_UPDATE_TIME        100000

#define WS_MAX_CLIENTS             4

#define CFG_WIFI_SSID              "Smart-Reamer"
#define CFG_WIFI_CHANNEL           4
#define CFG_WIFI_PASS              "00000000"
#define CFG_WIFI_MAX_CONN          10

#define CFG_WIFI_STA_SSID          "FMI-AIR-NEW"
#define CFG_WIFI_STA_PASS          ""

#define CFG_WIFI_STA_MAX_TRIES     10

// ------------- LOCK CONFIG --------
#define LOCK_MOTOR_POS_LOCKED      800
#define LOCK_MOTOR_POS_UNLOCKED    0
#define MAX_PAIRED_DEVICES         10
#define FIRMWARE_VERSION           "1.0.0"
#define NVS_NAMESPACE_LOCK         "lock"
#define NVS_KEY_LOCK_STATE         "locked"
#define NVS_NAMESPACE_AUTH         "auth"
#define NVS_KEY_TOKEN_PREFIX       "tok"
#define NVS_NAMESPACE_WIFI         "wifi_prov"
#define NVS_KEY_STA_SSID           "sta_ssid"
#define NVS_KEY_STA_PASS           "sta_pass"
#define NVS_KEY_PROVISIONED        "provisioned"

// ------------- CONFIG -------------
#define MAX_ERROR_MSG_BYTES        255
