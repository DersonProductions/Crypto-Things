// /examples/10-dapps-for-digitizing-medical-records-example.js
//
// This JavaScript file demonstrates a complete example of using proxy re-encryption (PRE) for secure medical record sharing
// on a blockchain-compatible setup. It generates wallets for a patient and doctor, encrypts a mock medical record using
// the patient's private key, generates a re-encryption key, and then simulates signing a transaction off-chain to upload
// the ciphertext hash or metadata to a smart contract. This aligns with the concepts in docs/10-dapps-for-digitizing-medical-records.md,
// showcasing libraries like ethereumjs-wallet (key gen), ethereumjs-tx (tx building/signing), ethereumjs-util (utils),
// and npre (PRE implementation).
//
// JavaScript Best Practices Incorporated:
// - Strict Mode: Enabled with 'use strict' to catch common errors and prevent unsafe actions.
// - Modular Structure: Use const for immutables, async/await for readable async code.
// - Error Handling: Try-catch blocks for async operations, with meaningful logs.
// - Readability: Descriptive variable names, inline comments, consistent spacing (2 spaces indent).
// - Security: Private keys generated locally; never hard-code or expose them.
// - Dependencies: Explicit requires at top; assume installed via npm.
// - Portability: Use Buffer for binary data; hex encoding for logs.
// - Linting/Style: Follows Airbnb style (e.g., no var, trailing commas).
// - Performance: Minimal ops; no unnecessary globals.
// - Testing: Console logs for output; in prod, use a logger like winston.
//
// Note on Libraries:
// - npre: A simple PRE lib; in prod, use audited ones like NuCypher or custom based on libsodium.
// - For blockchain: This signs off-chain; integrate with web3.js (archived, migrate to Viem/Ethers.js) to send.
// - Extensions: For other services (e.g., tax records), replace 'record' with payment proofs; encrypt and share similarly.
//
// Requirements:
// - npm install ethereumjs-wallet ethereumjs-tx ethereumjs-util npre
// - Node.js v14+ for async support.
//
// Usage: node 10-dapps-for-digitizing-medical-records-example.js
// Output: Logs keys, ciphertext, re-enc key, and signed tx hex (mock broadcast).

'use strict';  // Enable strict mode for safer code execution.

const Wallet = require('ethereumjs-wallet').default;  // For generating Ethereum-compatible wallets/keys.
const Transaction = require('ethereumjs-tx').Transaction;  // For building and signing transactions off-chain.
const util = require('ethereumjs-util');  // Utility functions like buffer conversions, hashing.
const npre = require('npre');  // Proxy re-encryption library (simple implementation; verify for prod use).

async function main() {  // Wrap in async main for top-level await; best for scripts with promises.
  try {
    // Step 1: Generate wallets for patient and doctor.
    // Best practice: Use secure random generation; store securely in prod (e.g., hardware wallet).
    const patientWallet = Wallet.generate();
    const doctorWallet = Wallet.generate();
    const patientPrivateKey = patientWallet.getPrivateKey();  // Buffer; used for encryption/signing.
    const doctorPrivateKey = doctorWallet.getPrivateKey();

    console.log('Patient Address:', patientWallet.getAddressString());  // Log for demo; derive from pub key.
    console.log('Doctor Address:', doctorWallet.getAddressString());

    // Step 2: Prepare mock medical record data.
    // In real app: This could be JSON.stringify({ bp: '120/80', notes: '...' }); encrypt sensitive fields.
    // Extension for tax records: Buffer.from(JSON.stringify({ propertyId: '123', payment: 5000, date: '2025-09-13' }));
    const record = Buffer.from('Patient vitals: BP 120/80');  // Convert string to Buffer for binary ops.

    // Step 3: Initialize PRE and perform encryption + re-key generation.
    // npre setup: Assumes default elliptic curve; customize if needed for security.
    const pre = new npre();  // Create PRE instance.
    const ciphertext = pre.encrypt(patientPrivateKey, record);  // Encrypt with patient's key.
    const reEncryptionKey = pre.reKeyGen(patientPrivateKey, doctorPrivateKey);  // Gen key for proxy.

    console.log('Encrypted Ciphertext (hex):', ciphertext.toString('hex'));  // Log for verification.
    console.log('Re-Encryption Key (hex):', reEncryptionKey.toString('hex'));  // Share this securely with proxy.

    // Step 4: Simulate proxy re-encryption (for completeness; in real, proxy does this).
    // Doctor decrypts the result.
    const reEncrypted = pre.reEncrypt(ciphertext, reEncryptionKey);  // Proxy transforms without decrypting.
    const decrypted = pre.decrypt(doctorPrivateKey, reEncrypted);  // Doctor decrypts.
    console.log('Decrypted by Doctor:', decrypted.toString());  // Should match original record.

    // Step 5: Build and sign a transaction off-chain to upload metadata (e.g., ciphertext hash) to blockchain.
    // Hash the ciphertext for on-chain storage (immutability proof); full data on IPFS.
    const dataHash = util.keccak256(ciphertext).toString('hex');  // Use ethereumjs-util for hashing.
    const txData = Buffer.from(`Upload medical record hash: ${dataHash}`);  // Mock calldata; in real, ABI-encoded.

    // Get nonce/gas (in prod, fetch async from node via web3.js or Ethers).
    // Here, mock values for demo; replace with actual.
    const nonce = 0;  // Await w3.eth.getTransactionCount(patientWallet.getAddressString());
    const gasPrice = '20000000000';  // Await w3.eth.getGasPrice();
    const gasLimit = 21000;  // Base for simple tx; estimate for contract calls.

    // Build tx object.
    const txParams = {
      nonce: util.toBuffer(nonce),
      gasPrice: util.toBuffer(gasPrice),
      gasLimit: util.toBuffer(gasLimit),
      to: '0xContractAddressForRecords',  // Replace with actual smart contract address.
      value: util.toBuffer(0),  // No ETH transfer.
      data: txData,  // Or ABI-encoded function call, e.g., storeHash(hash).
    };

    // Create Transaction with chain params (e.g., for Sepolia testnet; adjust for mainnet/Quorum).
    const common = util.Common.custom({ chainId: 11155111 });  // Sepolia chainId; use 1 for mainnet.
    const tx = new Transaction(txParams, { common });

    // Sign with patient's private key (off-chain security).
    tx.sign(patientPrivateKey);

    // Serialize to hex for broadcasting.
    const signedTxHex = '0x' + tx.serialize().toString('hex');
    console.log('Signed Transaction Hex:', signedTxHex);

    // In real app: Broadcast via web3.eth.sendSignedTransaction(signedTxHex).
    // Extension for fiduciary records: Upload hash of encrypted tax docs; share re-key with regulators.

  } catch (error) {  // Catch and handle errors gracefully.
    console.error('Error in process:', error.message);
    // In prod: Log to file/service; retry logic if transient.
  }
}

main();  // Execute the main function.
// In modules: Export main for testing/reuse.