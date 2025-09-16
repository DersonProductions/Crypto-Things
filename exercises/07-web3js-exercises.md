# 07 - web3.js Exercises

NOTE: web3.js has been archived. I will be making examples for viem or ether.js once i've had time to review.

## Introduction

This file provides starter code, hints, and sample solutions for the exercises outlined in `docs/07-web3js.md`. These hands-on tasks reinforce installing web3.js, connecting to a Geth node, and using it for queries and transactions in Node.js or client-side environments. Progress from beginner (setup) to advanced (transactions) to build practical skills.

**Prerequisites**: Node.js installed, a running local Geth/Quorum node (e.g., `geth --dev --http`), and a terminal/text editor. For client-side, a browser with MetaMask.

**Tips**:
- Run Node.js scripts with `node script.js`.
- Use async/await for cleaner code.
- In dev mode, accounts are pre-funded; unlock if needed.
- Debug with console logs or try-catch.
- Pull requests welcome for additions!

## Beginner: Install and Connect

### Exercise Prompt

Install web3.js and connect to a local Geth node; log the chain ID.

### Starter Code

Create `connect.js`:

```javascript
const Web3 = require('web3');

// TODO: Install web3 (npm install web3)
// Connect to local Geth
const web3 = new Web3('http://localhost:8545');

async function main() {
  // TODO: Check connection and log chain ID
}

main();
```

### Hints

- Install: `npm init -y && npm install web3`.
- Check: `await web3.eth.net.isListening()`.
- Chain ID: `await web3.eth.getChainId()` (e.g., 1337 for dev).

### Sample Solution

Complete:

```javascript
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

async function main() {
  const connected = await web3.eth.net.isListening();
  if (connected) {
    const chainId = await web3.eth.getChainId();
    console.log('Connected to chain ID:', chainId);
  } else {
    console.log('Connection failed');
  }
}

main();
```

Run: Should log "Connected to chain ID: 1337" (or your node's ID).

## Intermediate: Query Balance

### Exercise Prompt

Retrieve and convert the balance of an account to Ether using web3.js.

### Starter Code

Build on beginner; add to `connect.js`:

```javascript
async function main() {
  // Assume connected...
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];

  // TODO: Get balance and convert to Ether
}
```

### Hints

- Balance: `await web3.eth.getBalance(address)` (in Wei).
- Convert: `web3.utils.fromWei(balance, 'ether')`.
- Expected: In dev, something like '1000000' ETH.

### Sample Solution

Add:

```javascript
  const balanceWei = await web3.eth.getBalance(address);
  const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
  console.log(`Balance of ${address}: ${balanceEth} ETH`);
```

Output: Balance in readable ETH.

## Advanced: Send Transaction

### Exercise Prompt

Sign and send a simple ETH transfer in Node.js using web3.js.

### Starter Code

Extend `connect.js`:

```javascript
async function main() {
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  const to = accounts[1]; // Or a test address

  // TODO: Send 1 ETH (in Wei) from 'from' to 'to'
  // Hint: Use web3.eth.sendTransaction
}
```

### Hints

- Tx object: `{ from, to, value: web3.utils.toWei('1', 'ether') }`.
- In dev, no unlock needed; else, use `web3.eth.personal.unlockAccount`.
- Wait for receipt: `await web3.eth.sendTransaction(tx)`.
- Verify: Query balances before/after.

### Sample Solution

Add:

```javascript
  const tx = {
    from,
    to,
    value: web3.utils.toWei('1', 'ether'),
    gas: 21000 // Standard transfer gas
  };
  const receipt = await web3.eth.sendTransaction(tx);
  console.log('Transaction hash:', receipt.transactionHash);
```

Test: Balances update after tx.

## Further Challenges

- Client-side: Adapt for browser with MetaMask connection.
- Subscriptions: Subscribe to new blocks via WebSocket.
- Tie to staking: Send tx to a staking contract (link to 12-staking-and-interest-bearing-actions.md).

[Back to Docs: 07-web3js.md](../docs/07-web3js.md)