#!/bin/sh

command=$1
network=$2

if [ "$command" == "init" ]; then
  tfa_id=$2
  tfa=$3
fi

if [ "$LOCAL_BACKEND" == "" ]; then
  LOCAL_BACKEND=localhost
  LOCAL_PORT=8089
fi

curl "http://$LOCAL_BACKEND:$LOCAL_PORT/?command=$command&network=$network&2faId=$tfa_id&2fa=$tfa" 
# wget -O - "http://$LOCAL_BACKEND?command=$command&network=$network&2faId=$tfa_id&2fa=$tfa" > /dev/null 2>&1
