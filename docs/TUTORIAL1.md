
# Tutorial to write an end to end application

# Lottary project

In this tutorial we create an end-to-end application that involves 
1) writing a solidity smart contract
2) creating a backend and database and
3) creating a UI to interact with it.

## Definition

**Smart Contract**

- We create a lottery smart contract.
- Players, will buy *ONE* lottery ticket (One - for simplicity).
- At the end, owner runs closes the lottery, which will reset the system
 and distribute the rewards to the winner.

**Database**

- Winners. A collection that shows the historical list of winners.
 For simplicity, we assume admin will manually update the collection.

**Backend**

- Sign in, functionality for users. (some features only available to connected users)
- Db & Chain interactions

**Frontend**

- Show list of winners
- See current players
- Buy a ticket (approval may be required)

## Set up

**Requirements**

- You need a unix console (mac / ubuntu / windows WSL2.0).
- Install `nvm` and `node` version 14
- Install `VSCode` with typescript extensions
- Create a free `mongodb atlas` database, create a database, and a connection string
- Install `metamask` with some testnet (rinkeby) tokens

**Preperation**

1. Create a fork for `ferrum-gateway` repository. And clone the repo on your desktop
2. Create two new folders in the `ferrum-gateway` root: `lottery-backend` and `lottery-frontend`
3. Update `package.json` in the root and add `lottery-backend` and `lottery-frontend` to the list of projects.
4. Copy content of `./backend` folder to `lottery-backend`
5. Copy content of `./frontend` folder to `lottery-frontend`

## Smart contract

Compile the following code in remix and deploy to testnet:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address[] public players;
    address public winner;
    
    function buy() external {
        players.push(msg.sender);
    }

    function finish() external {
        uint len = players.length;
        uint idx = block.timestamp % len;
        winner = players[idx];
        delete players;
    }
}
```

## Backend

Backend has 5 files in the `src` folder:

- `index.ts` Which is the entry point to the backend.
- `LotteryModule.ts` Which sets up the dependencies for the project (we extensively use IoC design pattern).
- `Model.ts` Which has data models, to work with database.
- `Service.ts` A service that interacts with database, and blockchain. Generates transactions for the frontend.
- `RequestProcessor.ts` The JSON RPC, API definition. Note that we don't use REST API here. We use old fashion JSON RPC
 as it is more compatible with most blockchain applications and can work with a wide variety of backend hostings.

 ## Frontend

TBD

## Running Backend

First populate the database. Create a collection called `winners`, and add records with the following format:

```
{
    "timestamp": 1,
    "address": "0x0012312312",
    "amount": "0"
}
```

Then set the follwing environment variables:

```
$ export CONNECTION_STRING="mongodb+svs://...."
$ export RINKEBY_PROVIDER="..."
$ export RINKEBY_CONTRACT_ADDRESS="0x..."
```

Then, go to the `lottery-backend` folder. Then run:

```
$ yarn
$ node ./SimLambda.js
```

To test the backend, run the following `curl` command. It should return the list of winners.

```
$ curl -X POST -H 'Content-Type: application/json' -d '{"method": "winners", "data": {}}' localhost:8080
```

## Running Frontend

Go to the frontend folder. Then run:

```
$ yarn
$ yarn start
```

## Test scenarios

1. Deploy the contract
2. Add some dummy winner list to DB
3. Open the UI, you should see the list of winners
4. Connect to `rinkeby`
5. You should see the "Last Winner" and "Buy ticket" buttons
6. Click on "Buy ticket"
7. From remix, call `finish`
8. Refresh UI and connect again. You shouls see the "last winner" changed
