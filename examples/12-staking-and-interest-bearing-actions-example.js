// /examples/12-staking-and-interest-bearing-actions-example.js
//
// This JavaScript file demonstrates interacting with a deployed staking contract (from docs/12-staking-and-interest-bearing-actions.md)
// using web3.js. It covers key steps: approving tokens, staking an amount, calculating rewards after a delay (mocked via timeout),
// claiming rewards, and unstaking. This simulates a user's flow in a staking DApp, highlighting interest accrual over time.
//
// JavaScript Best Practices Incorporated:
// - Strict Mode: 'use strict' to prevent common errors and enforce better coding habits.
// - Async/Await: Used for handling Promises in a readable, synchronous-like manner.
// - Error Handling: Comprehensive try-catch blocks with specific error logging for debugging.
// - Modularity: Functions for each major action (approve, stake, calculateRewards, claim, unstake) to promote reuse and testing.
// - Constants: Uppercase for immutable values like RPC URLs and contract details.
// - Security: Private key loaded from environment variables (process.env.PRIVATE_KEY) to avoid hard-coding sensitive data.
// - Readability: Descriptive variable/function names, consistent indentation (2 spaces), and detailed inline comments.
// - Dependencies: Listed at the top; use audited libraries like @openzeppelin (assumed in contract).
// - Logging: Console outputs for each step; in production, integrate a logger like Winston or Pino.
// - Web3.js Note: As archived, consider migrating to Viem or Ethers.js for future-proofing (e.g., Viem's writeContract).
// - Testing: Mock delay for time passage; in real tests, use Ganache time manipulation.
//
// Assumptions:
// - RewardToken and Staking contracts deployed (addresses hardcoded; replace with yours).
// - User has tokens; default account has balance.
// - Dev node running (http://localhost:8545) with no gas fees.
//
// Requirements:
// - npm install web3@1 (v1 for compatibility).
// - Set env: export PRIVATE_KEY=your-hex-private-key (use dotenv in prod).
//
// Usage: node 12-staking-and-interest-bearing-actions-example.js
// Output: Step-by-step logs, including tx hashes and reward calculations.

'use strict';

const Web3 = require('web3');  // Blockchain interaction library.

const RPC_URL = 'http://localhost:8545';  // Local dev node; replace with testnet if needed.
const REWARD_TOKEN_ADDRESS = '0xYourDeployedRewardTokenAddress';  // From deployment.
const STAKING_ADDRESS = '0xYourDeployedStakingAddress';  // From deployment.
const REWARD_TOKEN_ABI = [  // Minimal ABI for approve/transferFrom (from ERC20).
  {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const STAKING_ABI = [  // From doc's Staking contract.
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "calculateRewards",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function main() {  // Async main function to orchestrate the flow.
  try {
    const w3 = new Web3(RPC_URL);  // Initialize Web3 connection.
    const accounts = await w3.eth.getAccounts();  // Get test accounts from node.
    const user = accounts[0];  // Use first account as staker.
    const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');  // Load securely (for signing if needed).

    const rewardToken = new w3.eth.Contract(REWARD_TOKEN_ABI, REWARD_TOKEN_ADDRESS);
    const staking = new w3.eth.Contract(STAKING_ABI, STAKING_ADDRESS);

    // Step 1: Approve tokens for staking contract.
    // Explanation: ERC20 requires approval before transferFrom (used in stake).
    const amount = 100;  // Stake amount (adjust based on decimals).
    await approveTokens(w3, rewardToken, user, STAKING_ADDRESS, amount);
    console.log(`Approved ${amount} tokens for staking.`);

    // Step 2: Stake the amount.
    // Explanation: Calls stake(), locking tokens and starting reward accrual.
    await stakeAmount(w3, staking, user, amount);
    console.log(`Staked ${amount} tokens.`);

    // Step 3: Wait for time passage (mock delay) and calculate rewards.
    // Explanation: Rewards accrue over time; simulate 10 seconds (in prod, real wait).
    await new Promise(resolve => setTimeout(resolve, 10000));  // Mock time.
    const rewards = await calculateRewards(staking, user);
    console.log(`Calculated Rewards: ${rewards}`);

    // Step 4: Claim rewards.
    // Explanation: Transfers accrued rewards to user; resets timer.
    await claimRewards(w3, staking, user);
    console.log('Rewards claimed.');

    // Step 5: Unstake the amount.
    // Explanation: Withdraws stake (plus any unclaimed rewards if compounded).
    await unstakeAmount(w3, staking, user, amount);
    console.log(`Unstaked ${amount} tokens.`);

  } catch (error) {
    console.error('Error in staking flow:', error.message);
    // Specific handling: e.g., if (error.message.includes('insufficient allowance')) { ... }
  }
}

// Function: Approve tokens.
async function approveTokens(w3, token, from, spender, amount) {
  const tx = {
    from,
    to: token.options.address,
    data: token.methods.approve(spender, amount).encodeABI(),
    gas: 200000
  };
  const signedTx = await w3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
  await w3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

// Function: Stake amount.
async function stakeAmount(w3, staking, from, amount) {
  const tx = {
    from,
    to: staking.options.address,
    data: staking.methods.stake(amount).encodeABI(),
    gas: 200000
  };
  const signedTx = await w3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
  await w3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

// Function: Calculate rewards (view call, no tx).
async function calculateRewards(staking, user) {
  return await staking.methods.calculateRewards(user).call();
}

// Function: Claim rewards.
async function claimRewards(w3, staking, from) {
  const tx = {
    from,
    to: staking.options.address,
    data: staking.methods.claimRewards().encodeABI(),
    gas: 200000
  };
  const signedTx = await w3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
  await w3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

// Function: Unstake amount.
async function unstakeAmount(w3, staking, from, amount) {
  const tx = {
    from,
    to: staking.options.address,
    data: staking.methods.unstake(amount).encodeABI(),
    gas: 200000
  };
  const signedTx = await w3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
  await w3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

main();  // Execute the script.