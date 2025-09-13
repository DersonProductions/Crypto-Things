# 10 - DApps for Digitizing Medical Records Exercises

## Introduction

This file contains starter code, hints, and sample solutions for the exercises outlined in `docs/10-dapps-for-digitizing-medical-records.md`. These hands-on tasks reinforce proxy re-encryption (PRE) for secure data sharing, key management with Ethereum libraries, and off-chain transaction signing. Progress from beginner (key basics) to advanced (full tx flow) to build skills for privacy-focused DApps.

**Prerequisites**: Node.js installed with libraries (`npm install ethereumjs-wallet ethereumjs-tx ethereumjs-util npre`), a running Geth/Quorum node for tx broadcasting. Use a test/dev chain.

**Tips**:
- Run scripts with `node script.js`.
- Handle buffers/hex carefully for keys/data.
- For security, never expose private keys in prod.
- Debug with console logs; use try-catch for errors.
- Contribute via pull requests!

## Beginner: Key Generation

### Exercise Prompt
Generate wallets with ethereumjs-wallet; log public keys.

### Starter Code
Create `key-gen.js`:

```javascript
const Wallet = require('ethereumjs-wallet').default;

// TODO: Generate two wallets (patient, doctor) and log their public keys
```

### Hints
- Use `Wallet.generate()` to create a wallet.
- Get public key: `wallet.getPublicKey().toString('hex')`.
- Expected: Two hex strings (e.g., '0x04...' for uncompressed).

### Sample Solution
Complete:

```javascript
const Wallet = require('ethereumjs-wallet').default;

const patientWallet = Wallet.generate();
const doctorWallet = Wallet.generate();

console.log('Patient Public Key:', patientWallet.getPublicKey().toString('hex'));
console.log('Doctor Public Key:', doctorWallet.getPublicKey().toString('hex'));
```

Run: Outputs two public keys. Use these in later exercises.

## Intermediate: Encrypt/Share

### Exercise Prompt
Encrypt a mock record with npre; generate re-encryption key.

### Starter Code
Build on beginner; add to `encrypt-share.js`:

```javascript
const npre = require('npre');
const Wallet = require('ethereumjs-wallet').default;

const patientWallet = Wallet.generate();
const doctorWallet = Wallet.generate();
const patientPK = patientWallet.getPrivateKey();
const doctorPK = doctorWallet.getPrivateKey();
const record = Buffer.from('Mock medical record');

// TODO: Encrypt with patient PK and generate re-encryption key for doctor
```

### Hints
- Init npre: `const pre = new npre();` (may need setup if elliptic curve).
- Encrypt: `pre.encrypt(patientPK, record)` (adapt to lib API; check npre docs).
- Re-key: `pre.reKeyGen(patientPK, doctorPK)`.
- Log ciphertext and re-key as hex.

### Sample Solution
Assuming npre API (adjust if needed):

```javascript
const npre = require('npre');
const pre = new npre();  // Initialize (may require curve setup)

const ciphertext = pre.encrypt(patientPK, record);
const reEncKey = pre.reKeyGen(patientPK, doctorPK);

console.log('Ciphertext:', ciphertext.toString('hex'));
console.log('Re-Encryption Key:', reEncKey.toString('hex'));
```

Output: Hex strings for encrypted data and key. Proxy can use reEncKey to re-encrypt without decrypting.

## Advanced: Off-Chain Tx

### Exercise Prompt
Sign and broadcast a tx with external keys; verify on-chain.

### Starter Code
`off-chain-tx.js`:

```javascript
const Web3 = require('web3');
const Transaction = require('ethereumjs-tx').Transaction;
const util = require('ethereumjs-util');
const Wallet = require('ethereumjs-wallet').default;

const w3 = new Web3('http://localhost:8545');
const wallet = Wallet.generate();
const privateKey = wallet.getPrivateKey();

// TODO: Build, sign, and send a tx (e.g., simple value transfer or data upload)
```

### Hints
- Get nonce: `await w3.eth.getTransactionCount(wallet.getAddressString())`.
- Build tx: Use Transaction with chain params.
- Sign: `tx.sign(privateKey)`.
- Send: `w3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))`.
- Verify: Check receipt for status.

### Sample Solution
Complete (simple value tx):

```javascript
async function sendOffChainTx() {
  const address = wallet.getAddressString();
  const nonce = await w3.eth.getTransactionCount(address);
  const txParams = {
    nonce: util.toBuffer(nonce),
    gasPrice: util.toBuffer(await w3.eth.getGasPrice()),
    gasLimit: util.toBuffer(21000),
    to: '0xRecipientAddress',  // Replace
    value: util.toBuffer(w3.utils.toWei('0.01', 'ether')),
    data: '0x'  // Or encrypted data hash
  };
  const tx = new Transaction(txParams, { chain: 'sepolia' });  // Adjust chain
  tx.sign(privateKey);
  const serializedTx = tx.serialize().toString('hex');
  const receipt = await w3.eth.sendSignedTransaction('0x' + serializedTx);
  console.log('Tx Hash:', receipt.transactionHash);
}

sendOffChainTx();
```

Run: Sends tx; log hash. Verify with `w3.eth.getTransactionReceipt(hash)`.

## Further Challenges
- Full PRE Flow: Re-encrypt ciphertext with proxy and decrypt as doctor.
- DApp Integration: Build a simple Express server to handle uploads/sharing.
- Extend to Other Services: Adapt for tax records—encrypt payment proofs, share re-encrypted with auditors (link to extensions in doc).
- Staking: Add staking for data access rights (preview 12-staking-and-interest-bearing-actions.md).

[Back to Docs: 10-dapps-for-digitizing-medical-records.md](../docs/10-dapps-for-digitizing-medical-records.md)