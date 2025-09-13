// /examples/11-payment-solutions-for-banks-example.js
//
// This JavaScript file provides a practical demonstration of implementing a private bank transfer using the PaymentBank smart contract
// from docs/11-payment-solutions-for-banks.md. It connects to a Quorum node, resolves a mobile number to an on-chain address,
// builds and signs a transaction off-chain for security, and broadcasts it with Quorum's privateFor for privacy (visible only to
// the recipient bank). This simulates a secure P2P payment in a permissioned network.
//
// JavaScript Best Practices Incorporated:
// - Strict Mode: 'use strict' to enforce safer coding practices.
// - Async/Await: For readable handling of Promises in blockchain interactions.
// - Error Handling: Comprehensive try-catch with specific error messages.
// - Modularity: Functions for each step (resolve, buildTx, signAndSend).
// - Constants: Uppercase for immutables like URLs, keys.
// - Security: Private key loaded from env (process.env.PRIVATE_KEY); never hard-code.
// - Readability: Descriptive names, comments per section, consistent formatting.
// - Dependencies: Listed at top; assume installed (npm install web3 ethereumjs-tx ethereumjs-util).
// - Logging: Console for demo; use winston in prod.
// - Web3.js Note: Archived; migrate to Viem/Ethers.js for new projects (as in 07).
//
// Background:
// - Assumes PaymentBank deployed (from intermediate exercise).
// - Mobile map: Mock DB; in real, use secure off-chain service with encryption.
// - PrivateFor: Quorum-specific; array of Tessera public keys for recipients.
// - Off-Chain Signing: Enhances security by keeping keys out of node.
//
// Requirements:
// - Node.js v14+.
// - npm install web3@1 ethereumjs-tx ethereumjs-util (v1 for compatibility).
// - Quorum node running with Tessera (privacy enabled).
// - Env vars: PRIVATE_KEY=your-hex-key (use dotenv for .env file).
//
// Usage: node 11-payment-solutions-for-banks-example.js
// Output: Tx hash if successful; errors otherwise.

'use strict';

const Web3 = require('web3');  // For Quorum interaction (extend with privateFor).
const Tx = require('ethereumjs-tx').Transaction;  // For off-chain tx building/signing.
const util = require('ethereumjs-util');  // Utilities like buffer handling.

const QUORUM_RPC = 'http://localhost:22000';  // Your Quorum node RPC (e.g., Node 1).
const CONTRACT_ADDRESS = '0xYourDeployedPaymentBankAddress';  // From deployment.
const ABI = [  // PaymentBank ABI from doc (trimmed; paste full).
  {
    "inputs": [{"internalType": "string", "name": "mobileTo", "type": "string"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
  // Add more as needed (e.g., registerMobile, mint).
];
const TO_BANK_PUB_KEY = 'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=';  // Mock Tessera pub key of recipient bank.

// Mock mobile-to-address resolver (in real: Secure DB/API with auth).
const MOBILE_MAP = {
  '+1234567890': '0xRecipientBankAddress'  // Replace with actual.
};

async function main() {  // Async entry point for await usage.
  try {
    const w3 = new Web3(QUORUM_RPC);  // Connect to Quorum.
    const contract = new w3.eth.Contract(ABI, CONTRACT_ADDRESS);

    // Step 1: Resolve mobile to address.
    const mobileTo = '+1234567890';  // Input mobile.
    const toAddress = resolveMobile(mobileTo);
    console.log(`Resolved ${mobileTo} to ${toAddress}`);

    // Step 2: Prepare transfer params.
    const amount = 100;  // Tokens/amount to transfer.
    const from = '0xYourSenderBankAddress';  // Derive from private key or accounts.
    const nonce = await w3.eth.getTransactionCount(from);  // Fetch nonce to avoid replays.
    const data = contract.methods.transfer(mobileTo, amount).encodeABI();  // Encode call.

    // Step 3: Build tx object.
    const txObject = buildTxObject(nonce, data);

    // Step 4: Sign and send with privateFor.
    const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');  // Load securely.
    const receipt = await signAndSendTx(w3, txObject, privateKey, [TO_BANK_PUB_KEY]);
    console.log('Transfer successful! Tx Hash:', receipt.transactionHash);

  } catch (error) {
    console.error('Error in payment process:', error.message);
    if (error.message.includes('invalid mobile')) {
      console.error('Tip: Check MOBILE_MAP or resolver.');
    } else if (error.message.includes('insufficient balance')) {
      console.error('Tip: Mint balance first via owner.');
    }
  }
}

// Helper: Resolve mobile to address.
function resolveMobile(mobile) {
  const address = MOBILE_MAP[mobile];
  if (!address) throw new Error('Invalid mobile number');
  return address;
}

// Helper: Build tx object.
function buildTxObject(nonce, data) {
  return {
    nonce: util.toBuffer(nonce),
    gasPrice: util.toBuffer(0),  // Quorum often zero gas.
    gasLimit: util.toBuffer(200000),  // Estimate based on call.
    to: CONTRACT_ADDRESS,
    value: util.toBuffer(0),
    data: Buffer.from(data.slice(2), 'hex')  // Remove 0x if present.
  };
}

// Helper: Sign and send tx with privateFor (Quorum extension).
async function signAndSendTx(w3, txObject, privateKey, privateFor) {
  const chainId = await w3.eth.getChainId();  // Fetch dynamically.
  const tx = new Tx(txObject, { chainId });
  tx.sign(privateKey);
  const serializedTx = '0x' + tx.serialize().toString('hex');

  // Send with privateFor for privacy.
  return w3.eth.sendSignedTransaction(serializedTx, { privateFor });
}

main();  // Run the script.