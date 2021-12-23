
# How to set up a node

Birdge V1:

a) Generator
b) Validator
c) Master node

### Prequisits:

- secure vm
- docker
- aws keys with access to a kms key (Ferrum team can provide you this)
- access to Frreum 2fa service (public and private hamc keys)
- access to Ferrum backend (public and private hmac keys)

In total you will need three sets of keys, one for an AWS account to encrypt keys locally. And two from Ferrum.

## Generator:

### Generator Checklist 

What keys you need to run generator

✔ RPC endpoint for all the supported networks
✔ HMAC keys for Ferrum Backend



Generator, only generates requsts. It interacts with the Ferrum backend and chain to do so. You will need the `generator-docker-compose.yml` file from this folder.

1. Ssh into your machine
2. Copy and update `docker-compose.yml` as necessary
3. Copy and update `config.json` as necessary
4. Run `docker-compose up -d`

### Docker-compose

Copy this docker-compose as `docker-compose.yml` to your generator folder.


```
version: '3'
services:
  generator:
    image: naiemk/bridge-node
    container_name: generator
    ports:
      - "8091:8091"
    environment:
      - CONFIG_FILES=/cfg/config
      - PORT=8091
    volumes:
      - ./config-generator.json:/cfg/config
    network_mode: host
  generatorloop:
    image: naiemk/bridge-node
    container_name: generatorloop
    environment:
      - LOCAL_BACKEND=localhost
      - LOCAL_PORT=8091
    network_mode: host
    entrypoint: ["gosu", "runner", "watch", "-n10", "/runner/bridge-loop.sh",  "BSC_TESTNET,AVAX_TESTNET,MUMBAI_TESTNET,MOON_MOONBASE,RINKEBY"]

```

 NOTE: Make sure to update the list of networks on the last line

### Configuration template

```
{
  "role": "generator",
  "providers": {
    "RINKEBY": "...",
    ...
  },
  "cmkKeyId": "A KMS Key ID to locally encrypt data>",
  "bridgeEndpoint": <The bridge endpoint>",
  "publicAccessKey": "<hmac public key for Ferrum backend>",
  "secretAccessKey": "<hmac secret key for Ferrum backend""
}
```

## Validator

### Validator Checklist 

What keys you need to run generator

✔ RPC endpoint for all the supported networks
✔ HMAC keys for Ferrum Backend
✔ HMAC keys for Ferrum 2fa Service
✔ One AWS KMS Key with AWS access keys


Running a validator has a few more steps than running a gnereator. This is because validators sign data with private keys and they are supposed to keep the data secure. To avoid storing keys on the machine, private key must be encrypted with two factor authentication. So in summary here is the steps to be taken by a validator:

1. Ssh into the server. Make suer no one else is able to ssh into this server
2. Create a validator folder and copy all the files below to the folder.
3. Create a new 2fa key: `./cryptor.sh new-2fa`
4. This will print you a 2fa-id. You will need to update all your config files with this `2fa-id`
5. Add the secret to your authenticator app. If you lose the secret you need to create and use a new private key.
6. Create a new encrypted private key: `./cryptor.sh privateKey --two-fa-id <YOUR 2fa ID> --two-fa <6 digit 2fa token from authenticator app>
7. Update the private key and two-fa-id in your `config.generator.
8. Run `docker-compose up -d` to bring up the serveices
9. Run `curl 'http://localhost:8089/command=init&twoFa=<2fa auth token>'` to initialize the validator.
10. To confirn that validator is initialized, run `curl 'http://localhost:8089/command=printSigner'`
11. Take a note of the signer. Pass this address to the Ferrum team to add them to the list of allowed actors.

### docker-compose.yml template

```
version: '3'
services:
  validator:
    image: naiemk/bridge-node
    container_name: validator
    ports:
      - "8089:8089"
    volumes:
      - ./config-validator.json:/cfg/config
    environment:
      - CONFIG_FILES=/cfg/config
      - AWS_ACCESS_KEY_ID=<YOUR AWS KEY>
      - AWS_SECRET_ACCESS_KEY=<YOUR AWS KEY>
    network_mode: host
  validatorloop:
    image: naiemk/bridge-node
    container_name: validatorloop
    environment:
      - LOCAL_BACKEND=localhost
      - LOCAL_PORT=8089
    network_mode: host
    entrypoint: ["gosu", "runner", "watch", "-n10", "/runner/bridge-loop.sh",  "RINKEBY,BSC_TESTNET,AVAX_TESTNET,MUMBAI_TESTNET,MOON_MOONBASE"]

```

### Configuration template

```
{
  "role": "validator",
  "providers": {
    "RINKEBY": ...,
    ...
  },
  "cmkKeyId": "<Your KMS ARN, AWS user should have access to>",
  "twoFa": {
    "uri": "https://p1te4k01x7.execute-api.us-east-2.amazonaws.com/default/prod-totp-v2",
    "accessKey": "<Ferrum 2fa hmac public key>",
    "secretKey": "<Ferrum 2fa hmac secret key>"
  },
  "bridgeEndpoint": "<BRIDGE ENDPOINT>",
  "publicAccessKey": "<Bridge hmac public key>",
  "secretAccessKey": "<Bridge hmac secret key>",
  "twoFaId": "<2fa ID aquired above>",
  "encryptedSignerKey": <Encrypted private key from above>"
```

### cryptor.sh

```
$ cat ./cryptor.sh

#!/bin/sh
docker run --env-file staging.env -ti --rm naiemk/ferrum-aws-lambda-helper-cryptor:0.1.0 $@
```

```
$ cat ./staging.env
AWS_KMS_KEY_ARN=
TWOFA_API_ACCESS_KEY=
TWOFA_API_SECRET_KEY=
TWOFA_API_URL=https://p1te4k01x7.execute-api.us-east-2.amazonaws.com/default/prod-totp-v2/
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-2
```

## Liquidity bot

Liquidity bot ensures a set amount of liquidity is maintained on the bridge. The configuration is very similar to validator with just the following difference:

```
 In docker-compose, rename the container to **liquidityBot**
```

### Configuration template

```
{
  "role": "liquidityBot",
  "providers": {
    "RINKEBY": ...,
    ...
  },
  "cmkKeyId": "<Your KMS ARN, AWS user should have access to>",
  "twoFa": {
    "uri": "https://p1te4k01x7.execute-api.us-east-2.amazonaws.com/default/prod-totp-v2",
    "accessKey": "<Ferrum 2fa hmac public key>",
    "secretKey": "<Ferrum 2fa hmac secret key>"
  },
  "bridgeEndpoint": "<BRIDGE ENDPOINT>",
  "publicAccessKey": "<Bridge hmac public key>",
  "secretAccessKey": "<Bridge hmac secret key>",
  "twoFaId": "<2fa ID aquired above>",
  "encryptedSignerKey": <Encrypted private key from above>",
  "liquidityLevels": {
    "RINKEBY:0xfe00ee6f00dd7ed533157f6250656b4e007e7179": 20000
  }

```

**liquidityLevels** fields in the config identifies token that we want to monitor with their corresponding target liquidity.

**Bridge Endpoints:
* **prod**: ...
* **staging**: https://api-gateway.stage.svcs.ferrumnetwork.io/gateway-backend-staging
* **dev**: ...


## Appendix 1 - How to get HMAC keys from Ferrum backend?

```
$ curl -X POST -d '{"command":"registerNewHmac", "data": {"adminSecret":"$ADMIN_SECRET"}}' https://api-gateway.stage.svcs.ferrumnetwork.io/gateway-backend-staging
```

## Appendix 2 - How to get HMAC keys for 2fa

```
$ curl -X POST -H "X-Secret: $SECRET" -H "Content-Type: application/json" -d '{"command":"newApiKey"}' https://p1te4k01x7.execute-api.us-east-2.amazonaws.com/default/prod-totp-v2
```

