#!/bin/bash

if [ -d "./target" ]; then
  echo Removing the target
  rm -rf ./target
fi

mkdir -p ./target
tar -czvf ./target/bridge-npde-1.tar.gz -C ./installed_structure .
sed -e "s/CONFIGURAION_PARAM/validator/g" ./install.sh.template > ./target/install-validator.sh
sed -e "s/CONFIGURAION_PARAM/generator/g" ./install.sh.template > ./target/install-generator.sh
sed -e "s/CONFIGURAION_PARAM/liquidityBot/g" ./install.sh.template > ./target/install-liquidityBot.sh
