# 08 - Interoperable Blockchains Exercises

## Introduction

This file contains starter guides, code snippets, hints, and sample solutions for the exercises in `docs/08-interoperable-blockchains.md`. These activities help you explore blockchain interoperability concepts, from research to hands-on setup and implementation. Begin with beginner for theoretical understanding, then advance to practical multi-chain building.

**Prerequisites**: Docker, Node.js with web3.js (or alternatives like Viem/Ethers.js), and basic Quorum knowledge from 05. For JS: `npm install web3`. Run a local setup for testing.

**Tips**:
- Use test environments to avoid real costs/risks.
- For bridges, start simple—real-world uses secure protocols.
- Debug with logs and tools like curl for RPC.
- Note: web3.js is archived; consider migrating to Viem or Ethers.js for new code (as mentioned in 07 examples).
- Contribute via pull requests!

## Beginner: Research Patterns

### Exercise Prompt
List 3 interoperability patterns and their pros/cons.

### Starter/Solution
This is research-based. No code; use web search or docs.

Sample response:
1. **Notary Schemes**: Trusted validators attest cross-chain events. Pros: Simple, flexible. Cons: Centralization risk, single point of failure.
2. **Hashed Time-Lock Contracts (HTLCs)**: Time-bound atomic swaps. Pros: Trustless, secure for value transfers. Cons: Complex setup, time-sensitive.
3. **Relay Chains**: Intermediate chains validate headers. Pros: Decentralized, scalable. Cons: Requires compatible protocols, potential latency.

Research more via references in the doc.

## Intermediate: Set Up Dual Chains

### Exercise Prompt
Launch two local Quorum nodes (as dual chains) and connect via web3.js.

### Starter Commands/Code
Use the docker-compose from examples (adapt for two chains).

1. Create `docker-compose.yml` (see examples for template).
2. Start: `docker-compose up -d`.
3. In JS (`dual-chains.js`):

```javascript
const Web3 = require('web3');

const web3A = new Web3('http://localhost:8545'); // Chain A
const web3B = new Web3('http://localhost:8546'); // Chain B

async function connectChains() {
  // TODO: Check connections and log chain IDs
}

connectChains();
```

### Hints
- Ensure different network IDs in genesis files.
- Verify: `await web3A.eth.getChainId()` and same for B.
- Expected: Two connected instances.

### Sample Solution
Complete:

```javascript
async function connectChains() {
  const connectedA = await web3A.eth.net.isListening();
  const connectedB = await web3B.eth.net.isListening();
  if (connectedA && connectedB) {
    console.log('Chain A ID:', await web3A.eth.getChainId());
    console.log('Chain B ID:', await web3B.eth.getChainId());
  } else {
    console.log('Connection failed');
  }
}
```

Run: Logs IDs (e.g., 1337 and 1338).

## Advanced: Implement Relay

### Exercise Prompt
Build a simple JS relay for message passing between chains (e.g., simulate FedCoin transfer).

### Starter Code
Extend `dual-chains.js`:

```javascript
// Assume connected web3A and web3B

// Mock contract ABIs/addresses (deploy simple contracts first)
const abi = [/* Simple message emitter ABI */];
const contractA = new web3A.eth.Contract(abi, '0xContractA');
const contractB = new web3B.eth.Contract(abi, '0xContractB');

async function relayMessage(fromChain, message) {
  // TODO: Send on fromChain, listen, relay to other
}
```

### Hints
- Deploy a basic event-emitting contract on each chain (e.g., emit MessageSent).
- Use subscriptions: `contractA.events.MessageSent().on('data', async (event) => { /* relay to B */ })`.
- Relay: Call method on other chain.
- For FedCoin: Burn on A, mint on B.

### Sample Solution
Assuming contracts with `sendMessage(string)` emitting event.

```javascript
// Subscribe to A and relay to B
contractA.events.MessageSent({
  fromBlock: 'latest'
}).on('data', async (event) => {
  const message = event.returnValues.message;
  const accountsB = await web3B.eth.getAccounts();
  await contractB.methods.receiveMessage(message).send({ from: accountsB[0] });
  console.log(`Relayed: ${message}`);
});

// Example trigger
async function relayMessage(fromChain, message) {
  const accountsA = await web3A.eth.getAccounts();
  await contractA.methods.sendMessage(message).send({ from: accountsA[0] });
}
```

This simulates basic relay; secure for production.

## Further Challenges
- Add HTLC: Implement time-locks in contracts.
- Privacy: Use Quorum's privateFor in relays.
- Staking: Relay staking actions across chains (link to 12-staking-and-interest-bearing-actions.md).

[Back to Docs: 08-interoperable-blockchains.md](../docs/08-interoperable-blockchains.md)