# 11 - Payment Solutions for Banks Exercises

## Introduction

This file provides starter guides, commands, code snippets, hints, and sample solutions for the exercises in `docs/11-payment-solutions-for-banks.md`. These activities reinforce network permissioning in Quorum, smart contract deployment for payments, and implementing private transfers. Begin with beginner for setup basics, then advance to full payment flows.

**Prerequisites**: Quorum network running (from 05 or 09), OpenSSL for certs, Node.js with web3.js (or alternatives), Solidity tools (e.g., Remix). A test/dev chain with at least two nodes for privacy testing.

**Tips**:
- Use a local Quorum setup for testing permissioning.
- For privateFor, ensure Tessera is enabled.
- Debug txs with `geth attach` and `debug.traceTransaction`.
- Secure private keys; use env vars in scripts.
- Pull requests welcome!

## Beginner: Permissioning Setup

### Exercise Prompt
Generate a CA and node cert; configure a Quorum node to use it.

### Starter Commands
1. Generate CA:

```
openssl req -new -x509 -days 365 -keyout ca.key -out ca.crt -subj "/CN=MyBankCA"
```

2. Generate node key/CSR:

```
openssl genpkey -algorithm RSA -out node.key
openssl req -new -key node.key -out node.csr -subj "/CN=BankNode1"
```

3. TODO: Sign CSR and configure Quorum.

### Hints
- Sign: `openssl x509 -req -in node.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out node.crt -days 365`.
- Config: In Quorum start command, add `--tls-server-cert=node.crt --tls-server-key=node.key --tls-known-clients=ca.crt`.
- Test: Start node; attempt join without cert to see rejection.

### Sample Solution
Sign CSR:

```
openssl x509 -req -in node.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out node.crt -days 365
```

Start Quorum:

```
geth --datadir qdata/dd1 --permissioned --tls-server-cert=node.crt --tls-server-key=node.key --tls-known-clients=ca.crt ...
```

Verify logs for successful permissioned mode. This sets up basic PKI for node auth.

## Intermediate: Contract Deployment

### Exercise Prompt
Deploy PaymentBank; register a mobile and mint initial balance.

### Starter Code
Use Solidity from doc; deploy with Remix or script.

In Node.js (`deploy-contract.js`):

```javascript
const Web3 = require('web3');
const w3 = new Web3('http://localhost:22000');
const bytecode = '0x...'; // Compiled bytecode
const abi = [/* ABI */];

// TODO: Deploy, then call registerMobile and mint
```

### Hints
- Deploy: `w3.eth.sendTransaction({ data: bytecode })` or use ethereumjs-tx for signing.
- Register: `contract.methods.registerMobile('+123', '0xAddr').send({ from: owner })`.
- Mint: `contract.methods.mint('0xAddr', 1000).send({ from: owner })`.
- Get address from receipt.contractAddress.

### Sample Solution
Deploy script snippet:

```javascript
async function deployAndInit() {
  const accounts = await w3.eth.getAccounts();
  const owner = accounts[0];
  const tx = { from: owner, data: bytecode, gas: 5000000 };
  const receipt = await w3.eth.sendTransaction(tx);
  const contract = new w3.eth.Contract(abi, receipt.contractAddress);

  await contract.methods.registerMobile('+1234567890', '0xRecipientAddress').send({ from: owner });
  await contract.methods.mint('0xRecipientAddress', 1000).send({ from: owner });
  console.log('Contract deployed at:', receipt.contractAddress);
}

deployAndInit();
```

Run: Deploys, registers mobile, mints balance. Verify with `balances` query.

## Advanced: Private Transfer

### Exercise Prompt
Implement a transfer with privateFor; verify only involved parties see it.

### Starter Code
Extend intermediate; add to `private-transfer.js`:

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const w3 = new Web3('http://localhost:22000');
const contract = new w3.eth.Contract(abi, '0xContractAddress');
const privateKey = Buffer.from('your-hex-private-key', 'hex');
const toBankPubKey = 'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc='; // Mock Tessera pub key

// TODO: Build, sign, send transfer tx with privateFor
```

### Hints
- Encode data: `contract.methods.transfer(mobileTo, amount).encodeABI()`.
- Tx object: Add `privateFor: [toBankPubKey]` in sendSignedTransaction (Quorum extension).
- Verify: On sender/receiver node, `eth.getTransaction(txHash)` shows data; on others, it's hashed.
- Use two Geth attaches for testing.

### Sample Solution
Complete:

```javascript
async function privateTransfer(mobileTo, amount) {
  const from = '0xYourFromAddress';
  const nonce = await w3.eth.getTransactionCount(from);
  const data = contract.methods.transfer(mobileTo, amount).encodeABI();
  const txObject = {
    nonce: nonce,
    gasPrice: 0,
    gasLimit: 200000,
    to: contract.options.address,
    data: data
  };
  const tx = new Tx(txObject, { chainId: 1337 }); // Adjust chainId
  tx.sign(privateKey);
  const serializedTx = tx.serialize().toString('hex');

  const receipt = await w3.eth.sendSignedTransaction('0x' + serializedTx, { privateFor: [toBankPubKey] });
  console.log('Private Tx Hash:', receipt.transactionHash);
}

privateTransfer('+1234567890', 100);
```

Test: Broadcast; check visibility on nodes. Ensures private banking transfers.

## Further Challenges
- Multi-Bank Permissioning: Add QNM to automate node onboarding with certs.
- Compliance Integration: Add oracle call in contract for KYC verification.
- Staking for Banks: Implement staking for liquidity providers in payments (link to 12-staking-and-interest-bearing-actions.md).

[Back to Docs: 11-payment-solutions-for-banks.md](../docs/11-payment-solutions-for-banks.md)