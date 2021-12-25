#!/bin/bash

# Ensure all configs are provided

set -e
curdir="$(cd "$(dirname "$0")"; pwd -P)/$(basename "$0")"
rundir="$(dirname "$curdir")"
rootdir="$(dirname "$rundir")"

if ! test -f "$rootdir/.bridgeconfig"; then
  echo Configuration files not found. Make sure scripts are installed properly
fi

config_root="/c"
config_files="$config_root/.bridgeconfig,$config_root/.providers"

if test -f "$rootdir/.2faconfig"; then
  config_files="$config_files,$config_root/.2faconfig,$config_root/.awsconfig"
fi

if test -f "$rootdir/.liquiditylevels"; then
  config_files="$config_files,$config_root/.liquiditylevels"
fi

function run_template {
  template_file=$1
  out_file=$2
  docker run -ti --rm --entrypoint 'node' -v ${rootdir}:${config_root} \
    naiemk/ferrum-aws-lambda-helper-cryptor:0.1.0 /c/bin/template.js $template_file $config_files --out=$out_file
}

mkdir -p "$rootdir/.cfg"
if test -f "$rootdir/.templates/cryptor.env.template"; then
  run_template $config_root/.templates/cryptor.env.template $config_root/.cfg/cryptor.env
fi
run_template $config_root/.templates/docker-compose.yml.template $config_root/.cfg/docker-compose.yml
run_template $config_root/.templates/node.config.template $config_root/.cfg/node.config
