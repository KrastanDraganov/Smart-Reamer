add_library(smart_reamer_lib OBJECT)

target_sources(smart_reamer_lib PRIVATE
    src/app.cpp
    src/clock.cpp
    src/measure.cpp
    src/writer.cpp
    src/error_tracker.cpp
    src/params.cpp
    src/motor.cpp
)

target_include_directories(smart_reamer_lib INTERFACE
    ${CMAKE_CURRENT_LIST_DIR}/src
)

set_property(TARGET smart_reamer_lib PROPERTY C_STANDARD 23)
set_property(TARGET smart_reamer_lib PROPERTY CXX_STANDARD 20)
target_compile_options(smart_reamer_lib PRIVATE
    -Werror
    -Wall -W -Wextra -Wpedantic
    -Wcast-align -Wcast-qual -Wchar-subscripts
    -Winline -Wpointer-arith
    -Wredundant-decls -Wshadow -Wwrite-strings
)
