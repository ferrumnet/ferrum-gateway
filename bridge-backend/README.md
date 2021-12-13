
## Build issues

If you are getting memory issues:

```
export NODE_OPTIONS=--max_old_space_size=14096
```

## Running Bridge Processor CLI


```
#!/bin/bash
exec &>>  /var/log/bridge/bridge.log

cd /root/bridge

echo Running $(date)>> /var/log/bridge/bridge.log 2>&1

docker ps --filter name=bridge-cli | grep bridge
if [ "$?" == "0" ]; then
  echo "Process already running"
  docker stop bridge-cli
fi

docker run --rm --init --env-file /root/bridge/test.env --name bridge-cli naiemk/bridge-cli:0.0.9 node ./index.js RINKEBY --all >> /var/log/bridge/bridge.log 2>&1
docker run --rm --init --env-file /root/bridge/test.env --name bridge-cli naiemk/bridge-cli:0.0.9 node ./index.js BSC_TESTNET --all >> /var/log/bridge/bridge.log 2>&1
docker run --rm --init --env-file /root/bridge/test.env --name bridge-cli naiemk/bridge-cli:0.0.9 node ./index.js MUMBAI_TESTNET --all >> /var/log/bridge/bridge.log 2>&1

# docker run --rm --init --env-file /root/bridge/test2.env --name bridge-cli naiemk/bridge-cli:0.0.10 node ./index.js RINKEBY --all >> /var/log/bridge/bridge.log 2>&1
# docker run --rm --init --env-file /root/bridge/test2.env --name bridge-cli naiemk/bridge-cli:0.0.10 node ./index.js BSC_TESTNET --all >> /var/log/bridge/bridge.log 2>&1
# docker run --rm --init --env-file /root/bridge/test2.env --name bridge-cli naiemk/bridge-cli:0.0.10 node ./index.js MUMBAI_TESTNET --all >> /var/log/bridge/bridge.log 2>&1

```
