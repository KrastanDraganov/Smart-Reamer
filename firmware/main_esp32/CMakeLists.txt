cmake_minimum_required(VERSION 3.5)

include($ENV{IDF_PATH}/tools/cmake/project.cmake)
project(smart_reamer)
add_subdirectory(../lib smart_reamer_lib)
