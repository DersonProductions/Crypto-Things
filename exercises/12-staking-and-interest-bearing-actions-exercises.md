# 12 - Staking and Interest-Bearing Actions Exercises

## Introduction

This file provides starter code, hints, and sample solutions for the exercises in `docs/12-staking-and-interest-bearing-actions.md`. These activities reinforce staking mechanics, interest calculations, and contract interactions, from basic math scripts to deploying and using staking contracts. Start with beginner for conceptual calculations, then move to intermediate and advanced for blockchain hands-on.

**Prerequisites**: Python or Node.js installed, a local/testnet Ethereum/Quorum node (e.g., Geth --dev), web3.js (`npm install web3`), OpenZeppelin contracts (`npm install @openzeppelin/contracts`), and Solidity compiler (e.g., solc or Remix).

**Tips**:
- Use a dev chain for free testing (no real ETH needed).
- For contracts, deploy via Remix or Hardhat for ease.
- Handle big numbers in JS/Python to avoid precision loss.
- Debug contracts with console.log equivalents (emit events).
- Contribute improvements via pull requests!

## Beginner: Calculate Interest

### Exercise Prompt

Write a script for simple and compound interest calculations.

### Starter Code

In Python (`interest-calc.py`):

```python
import math

def simple_interest(principal, rate, time):
    # TODO: Implement simple interest: P * r * t
    pass

def compound_interest(principal, rate, periods, time):
    # TODO: Implement compound: P * (1 + r/n)^(n*t)
    pass

# Test with P=1000, r=0.05, t=1, n=12
```

### Hints

- Simple: return principal * rate * time
- Compound: Use math.pow(1 + rate / periods, periods * time) * principal
- Expected: Simple ~50, Compound ~51.16 for test values.

### Sample Solution

Complete:

```python
import math

def simple_interest(principal, rate, time):
    return principal * rate * time

def compound_interest(principal, rate, periods, time):
    return principal * math.pow((1 + rate / periods), periods * time)

p = 1000
r = 0.05
t = 1
n = 12
print('Simple:', simple_interest(p, r, t))  # 50.0
print('Compound:', compound_interest(p, r, n, t))  # ~1051.16
```

Run: Outputs interest values. Extend to continuous with math.exp(r * t).

## Intermediate: Deploy Staking

### Exercise Prompt

Deploy RewardToken and Staking; stake from an account.

### Starter Code

In Node.js (`deploy-staking.js`):

```javascript
const Web3 = require('web3');
const w3 = new Web3('http://localhost:8545');  // Dev node

// TODO: Compile/deploy RewardToken, then Staking with its address
// Hint: Use solc or hard-code bytecode/ABI
// Then approve and stake 100 tokens
```

### Hints

- Compile Solidity from doc (use online solc or Remix for ABI/bytecode).
- Deploy: Send tx with bytecode.
- Staking constructor takes token address.
- Approve: token.methods.approve(stakingAddr, 100).send()
- Stake: staking.methods.stake(100).send()

### Sample Solution

Assuming ABI/bytecode ready:

```javascript
async function deployAndStake() {
  const accounts = await w3.eth.getAccounts();
  const tokenBytecode = '0x...';  // From compilation
  const tokenAbi = [/* ABI */];
  const tokenTx = { data: tokenBytecode, gas: 5000000 };
  const tokenReceipt = await w3.eth.sendTransaction(tokenTx);
  const token = new w3.eth.Contract(tokenAbi, tokenReceipt.contractAddress);

  const stakingBytecode = '0x...';  // With constructor ABI-encoded
  const stakingTx = { data: stakingBytecode + w3.eth.abi.encodeParameter('address', token.options.address).slice(2), gas: 5000000 };
  const stakingReceipt = await w3.eth.sendTransaction(stakingTx);
  const staking = new w3.eth.Contract(stakingAbi, stakingReceipt.contractAddress);

  await token.methods.approve(staking.options.address, 100).send({ from: accounts[0] });
  await staking.methods.stake(100).send({ from: accounts[0] });
  console.log('Staked at:', staking.options.address);
}

deployAndStake();
```

Run: Deploys contracts, stakes. Verify with `stakes[address]`.

## Advanced: Claim and Compound

### Exercise Prompt

Implement claim; add auto-compound on unstake.

### Starter Code

Extend contract Solidity:

```solidity
// Add to Staking contract
function unstake(uint256 amount) public {
    // TODO: Auto-claim and add rewards to stake before unstake
}
```

In JS: Call claim/unstake.

### Hints

- In contract: Calculate rewards, add to stakes[msg.sender] for compound.
- Then unstake amount (after update).
- JS: `staking.methods.claimRewards().send(); staking.methods.unstake(50).send();`
- Verify: Check balances before/after.

### Sample Solution

Updated contract:

```solidity
function unstake(uint256 amount) public {
    uint256 rewards = calculateRewards(msg.sender);
    stakes[msg.sender] += rewards;  // Compound
    stakeTimes[msg.sender] = block.timestamp;

    require(stakes[msg.sender] >= amount, "Insufficient stake");
    stakes[msg.sender] -= amount;
    rewardToken.transfer(msg.sender, amount);
}
```

JS test:

```javascript
async function claimAndCompoundUnstake() {
  await staking.methods.claimRewards().send({ from: accounts[0] });  // Manual claim
  await staking.methods.unstake(50).send({ from: accounts[0] });  // Auto-compounds before unstake
  const remaining = await staking.methods.stakes(accounts[0]).call();
  console.log('Remaining Stake:', remaining);
}

claimAndCompoundUnstake();
```

This compounds on unstake; adapt for periodic compounding.

## Further Challenges

- Liquid Staking: Issue receipt tokens on stake.
- Governance: Add voting power based on stakes.
- Integration: Link to bank payments (11) for interest on deposits.

[Back to Docs: 12-staking-and-interest-bearing-actions.md](../docs/12-staking-and-interest-bearing-actions.md)