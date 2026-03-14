#pragma once

#include <stdint.h>
#include <stdbool.h>
#include "config.h"

#ifdef __cplusplus
extern "C" {
#endif

// Exposed api
void  smart_reamer_main_loop_begin(void);
void  smart_reamer_main_loop_body(void);
void  smart_reamer_update_time(uint64_t t);
bool  smart_reamer_measure_enable_val(char* name);
char* smart_reamer_measure_get_json(void);
char* smart_reamer_measure_get_oneshot(void);
void  smart_reamer_measure_finished_using_json(void);

void smart_reamer_edit_config(const char* name, const char* value_str);

#ifdef __cplusplus
}
#endif
