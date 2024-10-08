#!/bin/bash

set -e

docker_account=806611346442.dkr.ecr.us-east-2.amazonaws.com
build_version=1.0.0
curdir="$(cd "$(dirname "$0")"; pwd -P)/$(basename "$0")"
rundir="$(dirname "$curdir")"
backenddir="$(dirname "$rundir")"
gatewaydir="$(dirname "$backenddir")"

echo Budlding the quantum portal backend

cd $gatewaydir
is_untracked=$(git diff-index --quiet HEAD -- || echo "untracked")

if [ "$is_untracked" == "untracked" ]; then
  echo Cannot build docker. You have un commited git changes
  exit -1
fi

# get last commit hash prepended with @ (i.e. @8a323d0)
function parse_git_hash() {
  git rev-parse --short HEAD 2> /dev/null | sed "s/\(.*\)/\1/"
}

last_commit=$(parse_git_hash)
echo LAST COM $last_commit
docker_tag="$docker_account/qp-explorer-backend:$build_version-$last_commit"
docker_tag_latest="$docker_account/qp-explorer-backend:latest"

echo Building docker image $docker_tag
docker build -f $rundir/QpBackend.Dockerfile --tag $docker_tag --progress=plain .
docker tag $docker_tag "$docker_tag_latest"

echo Done
