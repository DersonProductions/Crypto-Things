# 10 - Building DApps for Digitizing Medical Records

## Introduction

Digitizing medical records on blockchain enables secure, tamper-proof storage and sharing of sensitive health data while maintaining patient privacy and compliance (e.g., HIPAA). This DApp uses proxy re-encryption (PRE) to allow encrypted data sharing without exposing private keys—patients encrypt records, and proxies re-encrypt for authorized parties. This section dives into implementing PRE on blockchain, covering JavaScript/Python libraries like ethereumjs-wallet (for key management), ethereumjs-tx (transaction building), ethereumjs-util (utils like hashing), and npre (Node.js PRE library). You'll also learn signing transactions with keys stored outside a Geth node for enhanced security. Builds on smart contracts (06-smart-contracts.md) and web3.js (07-web3js.md) for Ethereum/Quorum integration.

**Why This Matters**:
- Healthcare data breaches cost billions; blockchain + PRE ensures immutable, selective access.
- Enables patient-centric control: Share records with doctors/pharmacies without full decryption.
- Scalable for global health systems, with audit trails for regulations.

**Prerequisites**: Node.js/Python, Geth/Quorum running (from 05), libraries: `npm install ethereumjs-wallet ethereumjs-tx ethereumjs-util npre` and `pip install web3 py-ecc`.

**Learning Outcomes**:
- Implement PRE for encrypted sharing.
- Use off-chain libraries for key/tx handling.
- Build a DApp frontend for record upload/query.

## How Proxy Re-Encryption Enables Encrypted Data Sharing

Proxy re-encryption (PRE) allows a proxy to transform ciphertext encrypted with one key (e.g., patient's) to another (e.g., doctor's) without learning the plaintext. On blockchain:
- **Workflow**: Patient encrypts record off-chain → Upload hash/ciphertext to smart contract → Generate re-encryption key → Proxy re-encrypts → Doctor decrypts.
- **Benefits**: Zero-knowledge sharing, reduces on-chain storage (use IPFS for files).
- **Libraries**:
  - **ethereumjs-wallet**: Generate/import Ethereum wallets for keys.
  - **ethereumjs-tx**: Construct/sign transactions offline.
  - **ethereumjs-util**: Utilities like keccak256 hashing, privateToPublic.
  - **npre**: PRE implementation for Node.js (based on ElGamal-like schemes).

Challenges: Key management, gas costs for on-chain verification.

## Signing Transactions with Keys Outside Geth

For security, store keys off-node; sign locally and broadcast via Geth.

### Step-by-Step
1. **Generate Keys**: Use ethereumjs-wallet.
2. **Build Tx**: Use ethereumjs-tx with nonce/gas.
3. **Sign**: With private key.
4. **Broadcast**: Send raw tx to Geth.

Example in Node.js (see below).

## Hands-On Examples

### Example 1: PRE-Enabled Record Sharing in Node.js
```javascript
const Wallet = require('ethereumjs-wallet').default;
const Transaction = require('ethereumjs-tx').Transaction;
const util = require('ethereumjs-util');
const npre = require('npre');  // PRE lib

// Generate patient/doctor keys
const patientWallet = Wallet.generate();
const doctorWallet = Wallet.generate();
const patientPK = patientWallet.getPrivateKey();
const doctorPK = doctorWallet.getPrivateKey();

// Encrypt record (mock data)
const record = Buffer.from('Patient vitals: BP 120/80');
const { ciphertext, reEncKey } = npre.encryptAndGenerateReKey(record, patientPK, doctorPK);

// Upload to IPFS/smart contract (mock)
console.log('Ciphertext:', ciphertext.toString('hex'));
console.log('Re-Enc Key (share privately):', reEncKey.toString('hex'));

// Sign tx outside Geth
const rawTx = new Transaction({
  nonce: 0,
  gasPrice: util.toBuffer('20000000000'),
  gasLimit: util.toBuffer('21000'),
  to: '0xContractAddress',
  value: util.toBuffer(0),
  data: Buffer.from('Upload record hash')  // Include ciphertext hash
}, { common: util.Common.forCustomChain('mainnet', { chainId: 1 }) });
rawTx.sign(patientPK);
const signedTx = rawTx.serialize().toString('hex');

// Broadcast: web3.eth.sendSignedTransaction(signedTx)
```

Full script in `/examples/10-dapps-for-digitizing-medical-records-example.js`. Python variant uses py-ecc for keys, web3 for tx.

### Example 2: Python Off-Chain Signing
```python
from eth_account import Account
from web3 import Web3
from nacl.public import PrivateKey  # For mock PRE

w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
account = Account.create()
signed_tx = w3.eth.account.sign_transaction({
    'to': '0x...',
    'value': 0,
    'gas': 21000,
    'gasPrice': w3.to_wei('20', 'gwei'),
    'nonce': w3.eth.get_transaction_count(account.address),
    'data': b'Upload encrypted record'
}, account.key)
w3.eth.send_raw_transaction(signed_tx.rawTransaction)
```

## Exercises

### Beginner: Key Generation
1. Generate wallets with ethereumjs-wallet; log public keys.

### Intermediate: Encrypt/Share
2. Encrypt a mock record with npre; generate re-Enc key.

### Advanced: Off-Chain Tx
3. Sign and broadcast a tx with external keys; verify on-chain.

Starters in `/exercises/10-dapps-for-digitizing-medical-records-exercises.md`.

## Advanced Topics/Extensions

### Extending to Other Services
This PRE + blockchain model is versatile beyond medical records, applicable to any sensitive public-yet-private data scenario requiring selective sharing and auditability:
- **Tax Record Payments for Property**: Encrypt property tax docs (e.g., ownership proofs, payment history) with owner's key. Use PRE to re-encrypt for auditors/government without full access. On-chain hashes ensure immutability; smart contracts automate payment triggers (e.g., escrow release on verification). Benefits: Reduces fraud in public records, enables compliant sharing with banks for mortgages.
- **Fiduciary Regulations (e.g., Trusts, Wills)**: For public fiduciary filings, encrypt beneficiary details. Trustees share re-encrypted views with regulators/courts. Blockchain logs access trails for compliance (e.g., GDPR/SOX). Extend with multi-sig for approvals.
- **Other Uses**: Supply chain provenance (share encrypted certs), legal docs (redacted sharing), or voting records (anonymous yet verifiable). Always integrate oracles for off-chain verification.

See interoperability (08) for cross-system sharing.

## References and Further Reading
- Proxy Re-Encryption in Blockchain: https://arxiv.org/abs/2103.12345
- ethereumjs Libraries: https://github.com/ethereumjs
- npre Docs: https://www.npmjs.com/package/npre
- Off-Chain Signing Guide: https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_signtransaction
- Pull requests welcome!

[Previous: 09-quorum-as-a-service-platform.md] | [Next: 11-payment-solutions-for-banks.md] | [Back to Docs TOC](../README.md)