#pragma once

#include "stdint.h"
#include "stdbool.h"

#ifdef __cplusplus
extern "C" {
#endif

// Required external functions
void smart_reamer_ex_log_info(const char* tag, const char* format, ...);
void smart_reamer_ex_log_err(const char* tag, const char* format, ...);

void smart_reamer_ex_blocking_delay(uint32_t ms);

void smart_reamer_ex_nvs_write_u32(const char* key, uint32_t value);
void smart_reamer_ex_nvs_read_u32(const char* key, uint32_t* value);

void smart_reamer_ex_motor_init(void);
void smart_reamer_ex_motor_run(void);
long smart_reamer_ex_motor_current_position(void);
void smart_reamer_ex_motor_go_to_steps(long position);

#ifdef __cplusplus
}
#endif
