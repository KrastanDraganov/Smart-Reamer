idf_component_register(
    SRCS
        "main.c"
        "ext_api.cpp"
        "websocket.c"
        "wifi.c"
        "web_server.c"
        "mdns_service.c"
        "../vendor/stepper_motor.cpp"
    INCLUDE_DIRS
        "."
        "../vendor"
    EMBED_TXTFILES
        "certs/servercert.pem"
        "certs/prvtkey.pem"
)

target_link_libraries(${COMPONENT_LIB} PRIVATE smart_reamer_lib)
target_compile_options(${COMPONENT_LIB} PRIVATE
    -Werror
    -Wall -W -Wextra -Wpedantic
    -Wcast-align -Wcast-qual -Wchar-subscripts
    -Winline -Wpointer-arith
    -Wshadow -Wwrite-strings
    -Wno-pedantic
    -Wno-cast-qual
)
