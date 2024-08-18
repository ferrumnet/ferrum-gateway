# QP Explorer Frontend

TBD...

## QP Miner Dashboard

Miner dashboard can be opened in the following url:

```
http://localhost:3000/qpminerstake
```

Terminology:

- *Delegate, or Miner:* The account that will be the miner an can assign node operators. This is usually a hardware wallet or a multisig
- *Operator:* The node operator. The account that runs on the node and does the mining / finalization
- *Staker:* Anyone can stake to a delegate. Once a delegate's total stake is larger than minimum, they can start mining.

Miner VS Validator:

 Both miners and validators need to have delegated stake against them, and assign operator. The Miner stake must be greater than the minimum, however, the validators are permissioned so their stake amount is not determined by QP.

Functionalities provided in the miner dashboard include:

- For staker: Stake to a delegate, get rewards, withdraw
- For delegate: To assign operator
- For operator: To register as miner node

### Setup

UI needs the backend, though uses minimal functionalities from backend.

To run the backend:

```bash
$ cd ./qp-explorer-node
$ source ./localConfig/dev.env
$ yarn backend
```

To run the frontend:

```bash
$ cd ./qp-explorer-frontend
$ yarn start
```

 NOTE: this package works with node v14. Running higher versions of the node will fail
