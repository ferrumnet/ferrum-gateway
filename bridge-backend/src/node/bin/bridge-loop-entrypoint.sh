#!/bin/sh
echo RUNNING WITH: 1- $1  2- $2    3- $3     4-$4

base=$(dirname "$0")
gosu runner watch -n1 "node $base/bridge-loop-network.sh \"$1\""