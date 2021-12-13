#!/bin/bash
build_version=0.0.1
docker_account=naiemk


set -e

echo Budlding for the bridge node

rm -rf ./target
# webpack

echo Webpack completed now, building the docker image

is_untracked=$(git diff-index --quiet HEAD -- || echo "untracked")

if [ "$is_untracked" == "untracked" ]; then
  echo Cannot build docker. You have un commited git changes
  # exit -1
fi

# get last commit hash prepended with @ (i.e. @8a323d0)
function parse_git_hash() {
  git rev-parse --short HEAD 2> /dev/null | sed "s/\(.*\)/\1/"
}

last_commit=$(parse_git_hash)
docker_tag="$docker_account/bridge-node:$build_version-$last_commit"

echo Building docker image $docker_tag
docker build ./BridgeNode.Dockerfile --tag $docker_tag
docker tag $docker_tag "$docker_account/bridge-node:latest"

echo Done

