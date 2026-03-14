#!/bin/bash

set -euo pipefail

cdir="$(dirname "$(readlink -f "${0}")")"

. "${cdir}"/build.sh

cd "${cdir}"

idf.py flash
if [[ $# -ge 1 ]] && [[ "${1}" == "monitor" ]]; then
    idf.py monitor
fi
