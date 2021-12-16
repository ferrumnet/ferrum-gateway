#!/bin/sh

set -e

#chown -R xxxuser:xxxgroup /data/logs
exec gosu runner node /runner/index.js $@