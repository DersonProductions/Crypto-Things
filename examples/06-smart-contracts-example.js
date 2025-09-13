// /examples/06-smart-contracts-example.js
//
// This JavaScript file demonstrates how to deploy a simple Solidity smart contract (e.g., the SimpleStorage contract
// from docs/06-smart-contracts.md) using the web3.js library in a Node.js environment. It connects to a local Ethereum
// or Quorum node, retrieves accounts, deploys the contract, and logs the deployed address. This script is designed
// to be run on your host machine, assuming a local blockchain node (like Geth in dev mode or a Quorum node) is running.
//
// Background and Purpose:
// - Smart contracts need to be deployed to a blockchain to become active. Deployment involves sending a special
//   transaction that includes the compiled bytecode of the contract.
// - web3.js is a popular JavaScript library for interacting with Ethereum-compatible blockchains. It abstracts away
//   low-level JSON-RPC calls, making it easier to deploy and interact with contracts.
// - This example focuses on deployment. For interaction (e.g., calling functions like set/get), see the exercises
//   or extend this script.
// - We're using async/await for modern, readable asynchronous code handling, as web3.js methods return Promises.
// - In a real setup, you'd replace the placeholder ABI and bytecode with actual values from compiling your Solidity
//   code (e.g., via solc: solc --bin --abi SimpleStorage.sol).
// - This script assumes a dev or test environment where gas costs are negligible and accounts are unlocked or
//   manageable. In production, handle private keys securely (e.g., via wallets like MetaMask or environment vars).
//
// Requirements:
// - Node.js installed (v14+ recommended for async support).
// - Install web3.js: Run 'npm init -y' in this directory, then 'npm install web3'.
// - A running local node: For Ethereum dev chain, run 'geth --dev --http --http.api personal,eth,net,web3'.
//   For Quorum, use the RPC from the quorum-examples Docker setup (e.g., http://localhost:22000 for Node 1).
// - Compile your Solidity contract to get ABI (JSON interface) and bytecode (hex string).
//
// Usage:
// - Update the ABI and bytecode placeholders with your contract's compiled output.
// - Run: node 06-smart-contracts-example.js
// - Expected output: Connection confirmation, list of accounts, and the deployed contract address.
// - If deployment fails, check console errors (e.g., insufficient gas, locked account).
//
// Troubleshooting:
// - Connection issues: Ensure the node is running and RPC is enabled/exposed on the specified URL.
//   Test with curl: curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://localhost:8545
// - Account unlocking: In dev mode, accounts are often unlocked; otherwise, use web3.eth.personal.unlockAccount().
// - Gas estimation: The fixed gas (1000000) is generous for simple contracts; use web3.eth.estimateGas() for precision.
// - Quorum specifics: For private contracts, add 'privateFor: ["recipientPublicKey"]' in the send options.
// - Version compatibility: This uses web3.js v1.x (v4+ has breaking changes; install 'web3@1' if needed).

const Web3 = require('web3');  // Import the web3.js library. This provides the Web3 class for blockchain interactions.

// Define the RPC URL for the blockchain node.
// - 'http://localhost:8545' is the default for Geth dev mode.
// - For Quorum (from 05-blockchain-quorum.md), use 'http://localhost:22000' or similar.
// - You could use testnets like 'https://sepolia.infura.io/v3/YOUR_KEY' for real Ethereum, but local is better for learning.
const web3 = new Web3('http://localhost:8545');  // Create a Web3 instance connected via HTTP provider.
// Other providers: WebsocketProvider for subscriptions, IPCProvider for local socket connections.

// Placeholder for the contract's ABI (Application Binary Interface).
// - ABI is a JSON array describing the contract's functions, events, etc.
// - Paste the actual ABI from your solc compilation here.
// - Example for SimpleStorage: [{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}, {"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const abi = [/* Paste your ABI JSON array here */];

// Placeholder for the compiled bytecode.
// - This is the EVM-executable code as a hex string starting with '0x'.
// - From solc --bin output.
// - Example for SimpleStorage: '0x608060405234801561001057600080fd5b50610173806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100ba565b610075565b005b61005f61008f565b60405161006c91906100f4565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b61009781610084565b81146100a257600080fd5b50565b6000813590506100b481610091565b92915050565b6000602082840312156100d0576100cf61007f565b5b60006100de848285016100a5565b91505092915050565b6100ee81610084565b82525050565b600060208201905061010960008301846100e5565b9291505056fea2646970667358221220d8e0a4e6e0b0e0b0e0b0e0b0e0b0e0b0e0b0e0b0e0b0e0b0e0b0e0b0e0b0e064736f6c63430008000033' (truncated for brevity; use your actual full string).
const bytecode = '0x/* Paste your bytecode hex string here */';

// Async function to handle deployment.
// - Using async/await to manage Promises from web3 methods.
// - This structure allows for easy error handling and sequential execution.
async function deploy() {
  try {
    // Check if connected to the node.
    // web3.eth.net.isListening() or simply await web3.eth.getChainId() can confirm connectivity.
    const chainId = await web3.eth.getChainId();
    console.log(`Connected to chain ID: ${chainId} (e.g., 1337 for Geth dev)`);

    // Retrieve available accounts from the node.
    // In dev mode, Geth provides pre-funded accounts.
    // accounts[0] will be used as the deployer.
    const accounts = await web3.eth.getAccounts();
    console.log('Available accounts:', accounts);

    // Create a Contract instance with the ABI.
    // This doesn't deploy yet; it's a factory for interacting with or deploying contracts.
    const contract = new web3.eth.Contract(abi);

    // Deploy the contract.
    // - deploy({ data: bytecode }) prepares the deployment transaction.
    // - send({ from: ..., gas: ... }) signs and broadcasts it.
    // - Gas: 1000000 is a safe estimate for simple contracts; adjust based on complexity.
    // - Returns a Contract instance with the address once mined.
    const deployed = await contract.deploy({ data: bytecode }).send({
      from: accounts[0],  // Deployer address.
      gas: 1000000,       // Gas limit; too low causes out-of-gas errors.
      // gasPrice: '0',   // Optional: In dev/Quorum, often zero.
    });

    // Log the deployed address.
    // Once deployed, you can interact with deployed.methods...
    console.log('Contract deployed at address:', deployed.options.address);
    
    // Optional: Verify deployment by checking code at address.
    const codeAtAddress = await web3.eth.getCode(deployed.options.address);
    console.log('Code at address (should match bytecode + constructor args):', codeAtAddress.substring(0, 20) + '...');

  } catch (error) {
    // Catch and log any errors, e.g., connection issues, insufficient funds, or compilation mismatches.
    console.error('Deployment failed:', error.message);
    if (error.receipt) {
      console.error('Transaction receipt (if available):', error.receipt);
    }
  }
}

// Call the deploy function to execute the script.
// This runs when the script is invoked.
deploy();

// Further Extensions:
// - Add interaction: After deployment, call deployed.methods.set(42).send(...)
// - Private deployment in Quorum: Add privateFor: ['QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc='] (public key of recipient).
// - Use environment vars: Load ABI/bytecode from files with fs.readFileSync.
// - Testing: Integrate with Mocha/Chai for unit tests.
// - See exercises/06-smart-contracts-exercises.md for more practice, like broadcasting transactions.