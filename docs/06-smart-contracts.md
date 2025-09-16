# 06 - Writing Smart Contracts

## Introduction

Smart contracts are self-executing programs stored on a blockchain that automatically enforce the terms of an agreement when predefined conditions are met. Written in languages like Solidity, they run on platforms such as Ethereum or Quorum, enabling trustless automation for applications like DApps (from 04-decentralized-applications.md). This section covers writing Solidity contracts, deploying them using Geth's interactive console, and broadcasting transactions with web3.js. It builds on Quorum setup (05-blockchain-quorum.md) for enterprise contexts.

**Why This Matters**:
- Smart contracts power decentralized finance, NFTs, and more, reducing intermediaries.
- They ensure immutability and transparency, but require careful coding to avoid vulnerabilities.
- Mastering deployment via tools like Geth and web3.js is essential for blockchain development.

**Prerequisites**: Basic Solidity knowledge, Geth installed (from Ethereum.org or Quorum docs), Node.js for web3.js, and a local/testnet setup. Install Solc (Solidity compiler) via npm: `npm install -g solc`.

**Learning Outcomes**:
- Write and compile simple Solidity contracts.
- Deploy using Geth's JavaScript console.
- Interact and broadcast transactions with web3.js.

## Basics of Smart Contracts

Smart contracts are like vending machines: Input (transaction) triggers output (action) without third parties. Key concepts:
- **Solidity**: High-level language for Ethereum Virtual Machine (EVM).
- **ABI and Bytecode**: ABI (Application Binary Interface) defines interaction; bytecode is compiled code for deployment.
- **Gas**: Computational cost; optimize to minimize fees.
- **Lifecycle**: Write → Compile → Deploy → Interact.

In Quorum, add privacy with `privateFor` for selective visibility.

## Writing Smart Contracts in Solidity

Start with a simple storage contract.

### Example Contract: SimpleStorage

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
```

- `pragma`: Specifies compiler version.
- Functions: `set` modifies state (costs gas); `get` reads (view, no gas).
- Compile: `solc --bin --abi SimpleStorage.sol` to get bytecode and ABI.

Pitfalls: Avoid infinite loops, handle overflows with SafeMath (or use ^0.8+ checks).

## Using Geth's Interactive Console to Deploy

Geth (Go Ethereum) provides a JS console for deployment.

### Step-by-Step Guide

1. **Start Geth**: For a local dev chain: `geth --datadir qdata/dd1 init genesis.json; geth --dev console`.
2. **Compile Contract**: Get ABI and bytecode from solc.
3. **Deploy in Console**:
   ```
   > var abi = [/* paste ABI */]
   > var bytecode = "0x/* paste bytecode */"
   > personal.unlockAccount(eth.accounts[0])
   > var contract = eth.contract(abi)
   > var deployed = contract.new({from: eth.accounts[0], data: bytecode, gas: 1000000})
   > deployed.address  // Wait for mining, then get address
   ```

For Quorum/Raft: Use attached console from 05 setup.

## Broadcasting Transactions Using web3.js

web3.js is a JS library for Ethereum interaction.

### Integration in Node.js
Install: `npm install web3`.

Script to deploy/interact (see examples folder).

## Hands-On Examples

### Example 1: Deploy via web3.js in Node.js

```javascript
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545'); // Or Quorum RPC

const abi = [/* ABI array */];
const bytecode = '0x/* bytecode */';

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(abi);
  const deployed = await contract.deploy({ data: bytecode }).send({ from: accounts[0], gas: 1000000 });
  console.log('Deployed at:', deployed.options.address);
}

deploy();
```

Full script in `/examples/06-smart-contracts-example.js`.

### Example 2: Interact with Deployed Contract

```javascript
async function interact(address) {
  const contract = new web3.eth.Contract(abi, address);
  await contract.methods.set(42).send({ from: accounts[0] });
  const value = await contract.methods.get().call();
  console.log('Stored value:', value);
}
```

## Exercises

### Beginner: Compile a Contract

1. Write and compile the SimpleStorage contract using solc.

### Intermediate: Deploy via Geth Console

2. Deploy it on a dev chain and retrieve the address.

### Advanced: web3.js Transaction

3. Broadcast a `set` transaction and query `get`.

Starters in `/exercises/06-smart-contracts-exercises.md`.

## Advanced Topics/Extensions

- Privacy in Quorum: Add `privateFor: ['recipientPublicKey']` in tx.
- Upgradable Contracts: Use proxies (see 10-dapps-for-digitizing-medical-records.md).
- Tie to staking: Contracts for token staking (12-staking-and-interest-bearing-actions.md).

## References and Further Reading

- Solidity Docs: https://docs.soliditylang.org
- Geth JS Console for Contracts: https://geth.ethereum.org/docs/interacting-with-geth/javascript-console-contracts
- web3.js Deployment Guide: https://docs.web3js.org/guides/smart_contracts/smart_contracts_guide/
- Deploy with web3.js Tutorial: https://docs.metamask.io/services/tutorials/ethereum/deploy-a-contract-using-web3.js/
- Pull requests welcome!

[Previous: 05-blockchain-quorum.md] | [Next: 07-web3js.md] | [Back to Docs TOC](../README.md)