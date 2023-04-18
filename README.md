# Ferrum Network Casper Network Bridge Backend

After you have forked and cloned the Ferrum Gateway monorepo](https://github.com/ferrumnet/ferrum-gateway) on your machine navigate to the ferrum-gateway directory and set upstream link, then starting installing dependecies and building in the following order.

```
cd ferrum-gateway
```

**Installation Requirements**

- Node version: ^v15.5.0
- Npm version: ^8.19.2

## To Run Backend via npm

Set the follwing environment variables as defined in `./gateway-backend/localConfig`:

```
$ export CONNECTION_STRING="mongodb+svs://...."
$ export RINKEBY_PROVIDER="..."
$ export RINKEBY_CONTRACT_ADDRESS="0x..."
```

Then, go to the `gateway-backend` folder. Then run:

```
$ yarn
$ node ./sim_lambda.js
```

## To Run Backend via docker

from root,

```
$ yarn
$ bin ./tsc-all.sh
$ bin ./build.sh
$ docker run -p 8080:8080 ${docker-image-id from build}
```

After executing either of the above changes, backend should be running localhost:8080

Also docker image can be pulled from `806611346442.dkr.ecr.us-east-2.amazonaws.com/ferrum-network:dev`

<br />

**Architecture**

The backend is built using NodeJs and web3 util libraries mainly for the conversion of non-EVM to EVM tokens in the caspers bridge. The approach taken for swap process on the EVM side of swaps is detailed as follows:

1) Details of Non-EVM to Evm swaps carried out on the bridge are saved in the db with necessary information such as

a) The swap amount
b) The sending Address on the non EVM swaps
c) Destination networks on the EVM chain.

2) The details from (1) above are used to create withdrawal item which is an encoding of the necessary details needed by the user details needed by the User to carry out swaps on the EVM chain.

3) The withdrawal item contains salient information such as the receiveAmount, payBySig, sendTimestamp etc.

**PayBySig**

The payBySIg entry in the withdrawal item is the most important part of withdrawal, the paybysig encodes the destination address for swaps to be sent to. The payBySig implementation for casper required a further redesign to the existing EMV paybysig generation as a result of mismatch in address length between the EVM networks (40) and casper network addresses (62).

Thus the approach taken to circumvent this issue was to 

a) Split the withdrawer casper address to into two parts i.e the first part is used in encoding the payBySig and decoded on withdrawal.

b) The second part of the address is concatenated on withdrawal of the item to verify the withdrawal of tokens on the EVM chain.

A sample of the generation process of the payBySig generation :

```
    const params = {
      contractName: "FERRUM_TOKEN_BRIDGE_POOL",
      contractVersion: "0.0.3",
      method: "WithdrawSigned",
      args: [
        { type: "address", name: "token", value: address },
        { type: "address", name: "payee", value: token },
        { type: "uint256", name: "amount", value: amountStr },
        { type: "bytes32", name: "salt", value: salt },
      ],
    } as Eip712.Eip712Params;

    const sig2 = Eip712.produceSignature(
      this.helper.web3(network),
      chainId,
      this.config.bridgeConfig.contractClient[network],
      params
    );
```

In the code block above, we can see the details encoded in the signature used for verification of withdrawals for individuals on the EVM chain.

4) The Withdrawal item generated above is used to in executing withdrawal transaction on the EVM chain.

# Contributing

If you would like to contribute to this repository, please fork the repository and create a new branch for your changes. Once you have made your changes, submit a pull request and we will review your changes.

Please ensure that your code follows the style and conventions used in the existing codebase, and that it passes all tests before submitting a pull request.
<br />

# License

The smart contracts in this repository are licensed under the MIT License.
