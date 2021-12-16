
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

## Steps for adding a new chain:

*Ferrum Plumbing*
- Plumbing (add to the NEtworks type and make sure networks.json has right info - specially the explorer)

- add bridge-frontend/src/assets/img/moonbase.png 
   TODO: Load assets from a json
- confirmationModa -> Icon for the chain. TODO: Move to a json
- [LEGIT] AppConfig -> SUPPORTED_CHAINS_FOR_CONFIG
- [LEGIT] consts -> BRIDGE_NETWORKS
- Update the WETH address: TODO: Move to config?
- image.js => Network images. TODO: Move to Json
- Contracts.ts