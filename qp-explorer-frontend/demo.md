# Setup for the demo


- Run the `ferrum-x-node`

```
cargo run -- --dev
```

- Run the `qp-explorer-node` for syncing

```
npx ts-node ./src/node/Server.ts
```

- Run the `qp-explorer-backend` 

```
node ./src/backend/sim_lambda.js
```

- Run the sync command every while to sync explorer

```
curl http://localhost:8089\?command\=sync\&remoteNetwork\=RINKEBY\&network\=BSC_TESTNET
```

- Register the smartcontract code and ABI

```
```
