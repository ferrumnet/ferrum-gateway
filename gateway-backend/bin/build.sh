#!/bin/sh

set -e
curdir="$(cd "$(dirname "$0")"; pwd -P)/$(basename "$0")"
rundir="$(dirname "$curdir")"
backenddir="$(dirname "$rundir")"
gatewaydir="$(dirname "$backenddir")"

echo Budlding the gateway backend

cd $backenddir
STANDALONE=true npx webpack

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
docker_tag_latest="$docker_account/bridge-node:latest"

echo Building docker image $docker_tag
docker build -f $rundir/GatewayBackend.Dockerfile --tag $docker_tag .
docker tag $docker_tag "$docker_tag_latest"

echo Done

