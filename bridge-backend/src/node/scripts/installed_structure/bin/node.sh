#!/bin/bash

# This script runs a node locally.
# It first ensures all configs are provided
# Then copies the configs into template files
# And uses the created files to run the actual
# commands.

# We accept one command here: [init, or help]

set -e
curdir="$(cd "$(dirname "$0")"; pwd -P)/$(basename "$0")"
rundir="$(dirname "$curdir")"
rootdir="$(dirname "$rundir")"

set -o allexport
source $rootdir/.bridgeconfig
set +o allexport

bash "$rundir/configure.sh"
if [ "$1" == "init" ]; then
    if test -f "$rootdir/.2faconfig"; then
      echo Enter google authenticator token
      read token
    fi

    curl "http://localhost:$port?command=init&twoFa=${token}"
elif  [ "$1" == "stop" ]; then
    docker-compose -f ./.cfg/docker-compose.yml down
    exit 0
elif  [ "$1" == "start" ]; then
    docker-compose  -f ./.cfg/docker-compose.yml rm -f
    docker-compose -f "./.cfg/docker-compose.yml" up -d
    exit 0
elif [ "$1" == "address" ]; then
    curl "http://localhost:$port?command=printSigner"
    echo
    exit 0
else
    echo SYNTAX:
    echo './bin/node.sh [start|stop|init|address]'
fi
