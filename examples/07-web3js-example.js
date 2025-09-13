// /examples/07-web3js-example.js
//
// This JavaScript file serves as a practical demonstration of using the web3.js library to connect to an Ethereum-compatible
// blockchain node (such as Geth or a Quorum node from earlier sections) and perform basic queries. It is intended to be run
// in a Node.js environment, showcasing connection establishment, connection verification, and retrieval of account information.
// This example builds directly on the concepts introduced in docs/07-web3js.md, providing a starting point for more complex
// interactions like deploying contracts or sending transactions.
//
// IMPORTANT NOTE ON WEB3.JS STATUS:
// As of March 4, 2025, the web3.js libraries have been officially archived and are no longer actively maintained by ChainSafe.
// This means no new features, bug fixes, or security updates will be provided. Developers are encouraged to transition to
// modern alternatives for new projects or when updating existing ones. Recommended replacements include:
// - Viem: A lightweight, modular library developed by the wagmi team, focused on TypeScript support, performance, and simplicity.
//   It's designed for modern Ethereum development and integrates well with React-based DApps. (See: https://viem.sh)
// - Ethers.js: A complete Ethereum wallet implementation and utilities library, still actively used and maintained as of 2025.
//   It offers robust features for signing, providers, and contract interactions with a smaller footprint than web3.js.
//   (See: https://ethers.org)
// For migration guides, refer to ChainSafe's blog post on the sunset (e.g., https://blog.chainsafe.io/web3-js-sunset/).
// Despite the archival, this example uses web3.js for educational purposes, as it remains functional for legacy systems
// and learning the fundamentals of blockchain interaction in JavaScript. If you're building production code, prioritize
// migrating to Viem or Ethers.js to ensure long-term support and security.
//
// Background and Purpose:
// - web3.js acts as a client-side library that communicates with blockchain nodes via JSON-RPC protocols.
// - It abstracts complex operations like encoding/decoding data, signing transactions, and handling events.
// - This script focuses on Node.js (server-side) usage, but web3.js can also be used client-side in browsers (e.g., with MetaMask).
// - In a full DApp, you'd combine this with frontend frameworks like React for user interfaces.
// - Key modules in web3.js: eth (for Ethereum-specific ops), net (network info), utils (conversions like Wei to Ether).
// - Async nature: Most methods return Promises, so we use async/await for readability and error handling.
//
// Requirements:
// - Node.js installed (v14+ recommended for optimal async support and module handling).
// - Install web3.js: In this directory, run 'npm init -y' to create a package.json, then 'npm install web3@1' (specify v1 if using
//   older syntax; note that v4+ has modular imports like 'import { Web3 } from "web3"' but we use require for compatibility).
// - A running blockchain node: For local testing, start Geth in dev mode with 'geth --dev --http --http.api personal,eth,net,web3'.
//   This exposes an HTTP RPC endpoint at http://localhost:8545.
//   For Quorum (from 05-blockchain-quorum.md), use an endpoint like 'http://localhost:22000' from the Docker setup.
// - No additional dependencies beyond web3.js for this basic example.
//
// Usage:
// - Update the connection URL if your node uses a different port or host (e.g., testnet via Infura: 'https://sepolia.infura.io/v3/YOUR_KEY').
// - Run the script: node 07-web3js-example.js
// - Expected output:
//   - 'Connected: true' if the node is responsive.
//   - 'First account: 0x...' displaying the first available account from the node (in dev mode, Geth provides pre-funded accounts).
// - Extend this: Add more queries like getting block number (web3.eth.getBlockNumber()) or balance (web3.eth.getBalance(address)).
//
// Troubleshooting:
// - Connection errors: Verify the node is running and RPC is enabled (--http flag in Geth). Test the endpoint manually with curl:
//   curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://localhost:8545
//   Should return something like {"jsonrpc":"2.0","id":1,"result":"Geth/v1.x.x..."}.
// - Module not found: Ensure 'npm install web3' was run in the correct directory.
// - Promise rejections: Wrap in try-catch for better error messages (expanded in this script).
// - Archived library warnings: If using newer Node.js, you might see deprecation notices; ignore for learning, but migrate for prod.
// - Quorum-specific: web3.js works seamlessly with Quorum's extensions (e.g., privateFor in transactions).
// - For client-side browser usage: Replace require with import or use a CDN, and connect to window.ethereum for wallet providers.

const Web3 = require('web3');  // Import the web3.js library using CommonJS require (for Node.js compatibility).
// In modern ES modules (with "type": "module" in package.json), you'd use: import Web3 from 'web3';
// Note: Since web3.js is archived, consider importing from Viem: import { createPublicClient, http } from 'viem';
// Or Ethers.js: import { ethers } from 'ethers';

const web3 = new Web3('http://localhost:8545');  // Instantiate Web3 with an HTTP provider.
// This connects to the node's RPC endpoint. Alternatives:
// - IPC: new Web3('/path/to/geth.ipc') for faster local access.
// - WebSocket: new Web3('ws://localhost:8546') for real-time subscriptions (e.g., events).
// - For testnets: new Web3('https://sepolia.infura.io/v3/YOUR_INFURA_KEY') – but requires an API key.
// In Viem equivalent: const client = createPublicClient({ transport: http('http://localhost:8545') });
// In Ethers.js: const provider = new ethers.JsonRpcProvider('http://localhost:8545');

async function main() {  // Define an async main function to handle Promises from web3 methods.
  try {  // Wrap in try-catch to handle errors gracefully, e.g., network issues or node unavailability.
    
    // Verify the connection by checking if the node is listening.
    // web3.eth.net.isListening() sends a net_listening RPC call, returning true if the node is active.
    // This is a good first check to ensure the provider is working.
    // Equivalent in Viem: await client.getChainId() (throws if disconnected).
    // In Ethers.js: await provider.getNetwork() (similarly throws on failure).
    const connected = await web3.eth.net.isListening();
    console.log('Connected:', connected);
    
    if (!connected) {  // Early exit if not connected, to avoid further errors.
      console.error('Failed to connect. Check your node and URL.');
      return;
    }
    
    // Retrieve the list of accounts managed by the node.
    // web3.eth.getAccounts() fetches accounts from the node (e.g., in Geth dev mode, it returns pre-generated accounts).
    // These can be used for signing transactions without external wallets.
    // Note: In production, avoid node-managed accounts for security; use wallets like MetaMask.
    // Equivalent in Viem: Not directly supported (Viem is read-only by default; use WalletClient for signing).
    // In Ethers.js: await provider.listAccounts() (if using a signer provider).
    const accounts = await web3.eth.getAccounts();
    console.log('First account:', accounts[0]);  // Log the first account address (e.g., '0x1234...').
    
    // Optional extension: Log more details, like the chain ID for network verification.
    const chainId = await web3.eth.getChainId();
    console.log('Chain ID:', chainId);  // e.g., 1337 for local dev, 1 for mainnet.
    
  } catch (error) {  // Catch any exceptions, such as network errors or RPC failures.
    console.error('An error occurred:', error.message);
    // Provide specific advice based on common errors.
    if (error.message.includes('ECONNREFUSED')) {
      console.error('Tip: Node might not be running or URL incorrect.');
    } else if (error.message.includes('Invalid JSON RPC')) {
      console.error('Tip: Check if the endpoint supports the method.');
    }
  }
}

main();  // Execute the main function when the script runs.
// In a larger app, you might export functions or integrate with Express for an API.

// Further Extensions and Migration Notes:
// - Add balance query: const balance = await web3.eth.getBalance(accounts[0]); console.log(web3.utils.fromWei(balance, 'ether'));
// - Event subscription (needs WebSocket): web3.eth.subscribe('newBlockHeaders', (err, block) => console.log(block));
// - Contract interaction: See 06-smart-contracts-example.js for deployment examples.
// - Migrating to Viem: Viem separates read (PublicClient) and write (WalletClient) actions for better security.
//   Example: import { createWalletClient, http } from 'viem'; const client = createWalletClient({ transport: http() });
// - Migrating to Ethers.js: More feature-rich for wallets; e.g., const signer = provider.getSigner(); await signer.sendTransaction(...);
// - For exercises: Build on this in /exercises/07-web3js-exercises.md, like sending transactions or client-side adaptations.
// - Resources: Even though archived, historical docs at https://web3js.readthedocs.io/; migrate using ChainSafe's guides.