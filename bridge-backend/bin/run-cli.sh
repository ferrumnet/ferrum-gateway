#!/bin/bash

if [ "$1" == "" ]; then
  echo 'SNYTAX: docker-run.sh <ENV FILE>'
  exit -1
fi

docker run --rm --env-file $1 --name bridge-cli naiemk/bridge-cli:0.0.1 node ./index.js $2
