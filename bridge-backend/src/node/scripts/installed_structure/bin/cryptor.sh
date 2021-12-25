#!/bin/bash

set -e
rundir=$(dirname "$0")
bash "$rundir/configure.sh"

docker run --env-file staging.env -ti --rm naiemk/ferrum-aws-lambda-helper-cryptor:0.1.0 $@
