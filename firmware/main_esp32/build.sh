#!/bin/bash

set -euo pipefail

cdir="$(dirname "$(readlink -f "${0}")")"
build_dir="${cdir}"/build

function msg {
    echo "${@}" >&2
}

function die {
    msg "${@}"
    exit 1
}

function do_build {
    if [[ ! -d "${build_dir}" ]]; then
        mkdir "${build_dir}"
        echo "$(readlink -f ${IDF_PATH})" > "${build_dir}"/.idf_path
        cd "${build_dir}"
        cmake -GNinja -DCMAKE_C_FLAGS="-fdiagnostics-color=always" -DCMAKE_BUILD_TYPE=RelWithDebInfo "${cdir}"
    fi

    (
        echo "building"
        cd "${build_dir}"
        ninja
    )
}

if [[ $# -eq 1 && "${1}" == shell ]]; then
    bash --rcfile <(echo ". ~/.bashrc; . '$(readlink -f "${0}")' export")
    exit 0
fi

if [[ ! -v IDF_PATH ]]; then
    if [[ -f "${build_dir}"/.idf_path ]]; then
        IDF_PATH="$(cat "${build_dir}"/.idf_path)"
    else
        die "please set the IDF_PATH env var to point to a directory with esp-idf"
    fi
fi

. "${IDF_PATH}"/export.sh

if [[ $# -ne 1 || "${1}" != export ]]; then
    do_build
fi
