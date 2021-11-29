
# Ferrum Network Crucible

## What is a Crucible Contract

Crucible is simply a token that wraps another token and adds extra functionality to the underlying token. We currently support fee on transaction crucibles. FOT crucible wraps a token and adds a fee on transaction and withdrawal.

## Anatomy of the Crucible System

Crucible consists of three contracts:

- **Crucible Factory**: This contract is responsible for deploying the crucible tokens. Burned base tokens also get collected in this contract and can be burned later. This is because some tokens might not have burn functionality. Instead we incarcerate them in the factory forever.
- **Crucible Router**: The router is used for most actions with the crucible token. User will need to approve the router first. All governance activity also happen through the router. Router has an owner that is the only entity that can create governance quorums. Once a governance quorum is created, then they will be able to do configuration.
- **Crucible Token**: The actual ERC20 wrapper token. It has fee per transaction and fee per withdraw. Transaction fees are charged in the crucible currency, but the withdrawal fee is the base currency.

There is also the `GeneralTaxDistributor` contract that can be specific to the crucible system or used across different systems. Admin can change the tax distributor address on the router.

### Create a quorum

The admin or owner of the router can create quorums:

```
    function initialize(
        address quorumId,
        uint64 groupId,
        uint16 minSignatures,
        uint8 ownerGroupId,
        address[] calldata addresses
    ) public virtual onlyAdmin { ... }

```

Check the governance documentation to understand how initialization, ownership, and updating the quorums work.

### Open Mint

By calling `setOpenCap` which is governed method on the router, once a crucible cap is opened up, anyone can mint crucible tokens until the cap is reached. Every time new crucible is minted the cap is reduced until it reaches zero. If user tries to mint more than the cap they will mint just the cap amount and the rest of the tokens will not get used.

Minting open crucibles can be done through either the `deposit` or `depositOpen` methods.

### Mint with Allocation

A quorum can be generated that allows allocations for a crucible. By default only allocations signed by a *delegated* group ID, or a governance group ID *ID < 256* are acceptable.

The group ID used for allocation - which can be a server - is usually different from the group ID used for config.

A `delegatedGroupId` is a group ID that can be configured for a crucible allocations. For example if a third party server can sign allocations for a specific crucible.

There are different type of allocations:

#### Direct allocation

Users can just mint crucible tokens by depositing the base token.

#### Staked allocation

Users can mint crucible and the minted crucible will be staked for the user. Stake address is included in the allocation.

#### Liquidity allocation

Users can mint crucible, but they also need to provide a base token for liquidity to generate LP tokens and the LP token will be auto staked. All the details are included in the allocation.

## How to deploy a standard crucible

There are two ways to deploy a crucible:

1. Using the `/deploy` UI. The crucible name and symbol will be auto generate based on the base token. Anyone can create a crucible using `/deploy`
2. Using the `createCrucibleDirect`. This is an only `onlyAdmin` function and any name can be provided for the crucible.

### Configuring the Tax Distributor

Tax distributed contract has a general config and a per token config.
