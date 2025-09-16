# 06 - Smart Contracts Exercises

## Introduction

This file contains starter code, commands, hints, and sample solutions for the exercises described in `docs/06-smart-contracts.md`. These activities help solidify your skills in writing, compiling, deploying, and interacting with Solidity smart contracts using Geth and web3.js. Start with beginner for basics, then move to intermediate and advanced for deployment and transactions.

**Prerequisites**: Solidity compiler (install via `npm install -g solc`), Geth installed and running in dev mode, Node.js (with `npm install web3`), and a text editor. For a local chain: Run `geth --dev console` or use the Quorum setup from 05.

**Tips**:
- Use a dev chain to avoid real gas costs.
- Unlock accounts before sending transactions (e.g., `personal.unlockAccount(eth.accounts[0])`).
- Debug Solidity with Remix IDE if needed (online tool).
- For JS scripts, run with `node script.js`.
- Contribute improvements via pull requests!

## Beginner: Compile a Contract

### Exercise Prompt

Write and compile the SimpleStorage contract using solc. Output the ABI and bytecode.

### Starter Code

Create a file `SimpleStorage.sol` with this:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    // TODO: Add the set and get functions
}
```

### Hints

- Complete the functions: `set` takes a uint256 and sets `storedData`; `get` returns it as view.
- Compile command: `solc --bin --abi SimpleStorage.sol > output.txt`.
- Expected: Bytecode starts with `0x6080...`, ABI is a JSON array.

### Sample Solution

Full contract (as in doc):

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

Compile: Run the solc command. Output includes:

- Bytecode: A long hex string.
- ABI: `[{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}, {"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]`

Save ABI and bytecode for later exercises.

## Intermediate: Deploy via Geth Console

### Exercise Prompt

Deploy the SimpleStorage contract on a dev chain using Geth's interactive console and retrieve the contract address.

### Starter Commands

1. Start Geth dev mode: `geth --dev console --datadir ./devchain`.
2. In console:

```
> personal.newAccount("password")  // Create account if needed
> personal.unlockAccount(eth.accounts[0], "password", 600)
> var abi = [/* Paste ABI from beginner */]
> var bytecode = "0x/* Paste bytecode */"
// TODO: Deploy the contract
```

### Hints

- Use `eth.contract(abi).new({from: eth.accounts[0], data: bytecode, gas: 1000000})`.
- Mine if needed: `miner.start(1); admin.sleepBlocks(1); miner.stop()`.
- Check `deployed.transactionHash` for tx, then `deployed.address` after confirmation.

### Sample Solution

In console:

```
> var contract = eth.contract(abi)
> var deployed = contract.new({from: eth.accounts[0], data: bytecode, gas: 1000000})
> miner.start(1); admin.sleepBlocks(1); miner.stop()
> deployed.address  // e.g., "0x1234...abcd"
```

Copy the address for advanced exercise.

## Advanced: web3.js Transaction

### Exercise Prompt

Using web3.js in a Node.js script, broadcast a `set` transaction to the deployed contract and query `get` to verify.

### Starter Code

Create `interact.js`:

```javascript
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545'); // Geth RPC

const abi = [/* Paste ABI */];
const contractAddress = '0x/* Paste address from intermediate */';

async function interact() {
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(abi, contractAddress);
  
  // TODO: Send set(42) tx and call get()
}

interact();
```

### Hints

- Unlock account if needed, but in dev mode, it's often open.
- Use `contract.methods.set(42).send({from: accounts[0], gas: 100000})`.
- Then `contract.methods.get().call()` for read.
- Run: `node interact.js`. Expected: Stored value: 42.

### Sample Solution

Complete function:

```javascript
async function interact() {
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(abi, contractAddress);
  
  // Send transaction
  await contract.methods.set(42).send({from: accounts[0], gas: 100000});
  
  // Query
  const value = await contract.methods.get().call();
  console.log('Stored value:', value);  // 42
}
```

This demonstrates full lifecycle: Deploy (intermediate) → Interact.

## Further Challenges

- Add privacy: Deploy with `privateFor` in Quorum (link to 05-blockchain-quorum.md).
- Error handling: Add try-catch for tx failures.
- Staking contract: Modify to include a stake function (preview 12-staking-and-interest-bearing-actions.md).

[Back to Docs: 06-smart-contracts.md](../docs/06-smart-contracts.md)