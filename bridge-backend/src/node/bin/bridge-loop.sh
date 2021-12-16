#!/bin/sh

echo RUNNING WITH: 1- $1  2- $2    3- $3     4-$4

networks=$(node -e "\"$1\".split(',').map(a => console.log(a))")
base=$(dirname "$0")
#echo base is $base

if test -f "/tmp/firsttime"; then
    echo
else
    echo "Initializing the container for the first time"
    sleep 5
    $base/bridge-call.sh init $1 $2 $3
    touch "/tmp/firsttime"
fi

echo Looping through networks $networks

for net in $networks
do
  $base/bridge-call.sh sync $net
done