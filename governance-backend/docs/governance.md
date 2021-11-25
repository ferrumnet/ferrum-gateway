# Ferrum Governance Smart Contract System

Ferrum governance smart contract system is an abstract smart contract that allows easy implementation of quorum based governance using EIP-712 messages.

## Smart Contract Design

Governance system, consists of quorums, that may be related together through groups.

Any project or contract that wants to utilize the governance system should do the following:

1. Extend the base contract (`MultiSigCheckable`).
2. Define the methods that have governance functionalities. For example, to increase the supply of a coin, one may write a `mint` method, but make the method a govened method, such that it can only be called by the governance multi-sig.
3. Configure the governance methods on the Ferrum Governance UI.

### What is a quorum?

In our setting, a quorum is a group that when a minimum number of its members sign a message, the message becomes actionable.

Quourm has an `id`, `groupId`, `members`, and `minSignatures`. MinSignatures is the minimum number of signatures the quourm requires. ID is any unique id in the format of an ethereum address. Members of a quorum are the multi-sig addresses. And the groupID is metadata that can be used by the smart contract for custom logics. For example by convention group IDs lower than 256 have a higher privilege than others.

Quorum can be initialized using the initialize method:

```
function initialize(
        address quorumId,
        uint64 groupId,
        uint16 minSignatures,
        uint8 ownerGroupId,
        address[] calldata addresses) {}
```

Members can be added / removed from the quorum by using `removeFromQuorum` and `addToQuorum` methods.Minimum number of signatures can be updated by calling `updateMinSignature`

An address can only be member of one quorum.

 In most cases only one single quorum may suffice for the purpose of the project. 

## Governance UI

Governance UI provides a user interface to generate and sign multi-sig mehtods as per Ferrum Network governance contract protocol.
To enable the UI for a contract, the contract should be configured and registered with the UI.

### Configuration

First, lets look at the contract registry. This is where each contract is registered. ***Every implementation of a contract must be registered*** For example if a contract is deployed on multiple network, each instance should be registered as a separate item.

The [GovernanceContractList.ts](https://github.com/ferrumnet/ferrum-gateway/blob/main/governance-backend/src/contracts/GovernanceContractList.ts) file holds the contract registry.

For example:

```
export const GovernanceContractList: RegisteredContract[] = [
	{
		network: 'RINKEBY',
		contractAddress: '0x678bf901030558e762f7d96cc0268d6591d3a309',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	},
	{
		network: 'POLYGON',
		contractAddress: '0xe369b5407f1ac0e956ae79ff91ead86e71c3cf14',
		governanceContractId: 'FERRUM_CRUCIBLE_ROUTER:000.001',
	}
];
```
Above code registers `FERRUM_CRUCIBLE_ROUTER` with version `000.001` on two networks of `RINKEBY` and `POLYGON`.

Once we have registered the contract instance, we then need to register the contract details.

Contract details can be registered as below:

1. Create a json file for the configuration. See the `CrucibleRouter.json` as example.
2. The json file has the following fields:
 - ***id***: The identifier. For example `FERRUM_CRUCIBLE_ROUTER:000.001`. This ID is used in the contract registration (pervious step)
 - ***identifier***: Has `name` and `version.
 - ***methods***: List of governance methods.

Each method configured in the json has the following fields:

- name: Method name. Same as what is used in the contract. Usually pascal cased. For example method `setOpenCap` on the contract will have the name `SetOpenCap`. This pascan naming is used for the signature as convention.
- governanceOnly: If this is a governacne method
- args: List if arguments to be ued in the signature. Each arg has the following fields: `{"type": "...", "name": "..."}`.
- abi: The method inputs `abi`.

 Note: By convention, every governance method has the follwing parameters as the last parameters: *uint64 expiry, uint64 expectedGroupId, bytes32 salt, bytes multiSignature*


### Full example

To show how easy it is to add governance functionality to your contracts, lets design a token with a mint function controlled by the governance:

```
contract GovernanceMintableToken is ERC20, MultisigCheckable {

  // Define the EIP712 signature here as below...
  constant MINT = keccack256("Mint(address to,uint256 amount,bytes32 salt,uint64 expiry)");

  function mint(address to, uint256 amount, bytes32 salt, uint64 expiry, uint64 expectedGroupId, bytes sig) external {
    // The next two lines verify the signature.
    bytes32 msg = keccack256(abi.encode(MINT, to, amount, salt, expiry));
    verifyUniqueSalt(msg, salt, expectedGroupId);

    // Continue with the normal functionality of the method
    _mint(to, amount);
  }
}

```
