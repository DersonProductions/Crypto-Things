# 12 - Staking and Interest-Bearing Actions

## Introduction

Staking and interest-bearing mechanisms allow cryptocurrency holders to earn rewards for locking their assets, supporting network security, governance, or liquidity. In proof-of-stake (PoS) systems like Ethereum 2.0 or enterprise forks (e.g., Quorum with QBFT), staking validates transactions and deters attacks. Interest-bearing actions extend this to DeFi, where holding tokens accrues yields via lending, farming, or vaults. This section covers staking basics, implementing simple staking contracts, calculating/compounding interest, and integrating with DApps (e.g., from 04-decentralized-applications.md). We'll use Solidity for contracts, web3.js for interactions, and explore rewards distribution. Builds on smart contracts (06-smart-contracts.md), Quorum (05-blockchain-quorum.md), and payments (11-payment-solutions-for-banks.md) for enterprise staking (e.g., bank loyalty tokens).

**Why This Matters**:
- Staking secures networks (e.g., Ethereum's 32 ETH minimum) while providing passive income (APY 4-6% in 2025).
- Interest-bearing: Fuels DeFi growth ($100B+ TVL in 2025); enables yield on stablecoins/bank assets.
- For banks: Tokenized deposits with interest, compliant with regs like Basel III.

**Prerequisites**: Solidity basics, web3.js, a testnet/Quorum node. Libraries: `npm install web3 @openzeppelin/contracts` (for safe math).

**Learning Outcomes**:
- Understand staking/interest mechanics.
- Build/deploy staking contracts.
- Implement claim/re-stake actions.
- Calculate yields with compounding.

## Basics of Staking and Interest-Bearing Mechanisms

### Staking

- **Proof-of-Stake (PoS)**: Validators stake tokens to propose/attest blocks; rewards from fees/inflation, slashes for misbehavior.
- **Types**: Native (e.g., ETH staking), Delegated (e.g., Cosmos), Liquid (e.g., Lido stETH).
- **Actions**: Stake, unstake (with lockup), claim rewards.
- **Risks**: Slashing (loss for downtime), impermanent loss in pools.

### Interest-Bearing

- **Mechanics**: Lock assets in protocols (e.g., Aave lending); earn interest from borrowers or liquidity incentives.
- **Compounding**: Re-invest earnings to grow principal (e.g., annual vs. continuous).
- **Formula**: Simple: P * r * t; Compound: P * (1 + r/n)^(nt); Continuous: P * e^(rt).
- **On-Chain**: Use timestamps for accrual (e.g., block.timestamp).

In Quorum: Permissioned staking for enterprise governance.

## Implementing Staking Contracts

Use OpenZeppelin for ERC20 tokens; add staking logic.

### Step-by-Step

1. **Token Contract**: ERC20 with minting.
2. **Staking Contract**: Stake, calculate rewards (e.g., fixed APY), claim.
3. **Explanation**: Track user stakes/timestamps; rewards = stake * rate * time.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("RewardToken", "RTK") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}

contract Staking {
    RewardToken public rewardToken;
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public stakeTimes;
    uint256 public rewardRate = 5;  // 5% per year (mock; adjust)

    constructor(address _rewardToken) {
        rewardToken = RewardToken(_rewardToken);
    }

    function stake(uint256 amount) public {
        rewardToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
        stakeTimes[msg.sender] = block.timestamp;  // Reset for simplicity
    }

    function calculateRewards(address user) public view returns (uint256) {
        uint256 timeStaked = block.timestamp - stakeTimes[user];
        return stakes[user] * rewardRate * timeStaked / (365 days * 100);  // Simple interest
    }

    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender);
        rewardToken.transfer(msg.sender, rewards);
        stakeTimes[msg.sender] = block.timestamp;  // Reset after claim
    }

    function unstake(uint256 amount) public {
        claimRewards();  // Auto-claim on unstake
        stakes[msg.sender] -= amount;
        rewardToken.transfer(msg.sender, amount);
    }
}
```

- Explanation: `stake` locks tokens; `calculateRewards` uses time delta; `claimRewards` pays out. For compounding, update stakes with rewards on actions.

## Interest-Bearing Actions

Extend for interest: Use vaults where deposits earn from pools.

### Compounding

- Manual: User claims/re-stakes.
- Auto: Contract compounds on interactions.

Example: Add `compound()` to add rewards to stake.

## Hands-On Examples

### Example 1: JS Staking Interaction

```javascript
const Web3 = require('web3');
const w3 = new Web3('http://localhost:8545');
const stakingAbi = [/* Staking ABI */];
const staking = new w3.eth.Contract(stakingAbi, '0xStakingAddress');

async function doStake(amount) {
  const accounts = await w3.eth.getAccounts();
  // Approve token transfer first
  await token.methods.approve(staking.options.address, amount).send({from: accounts[0]});
  await staking.methods.stake(amount).send({from: accounts[0]});
  console.log('Staked!');
}

doStake(100);
```

Full in `/examples/12-staking-and-interest-bearing-actions-example.js`.

### Example 2: Python Yield Calculator

```python
import math

def compound_interest(principal, rate, periods, times):
    return principal * math.pow((1 + rate / periods), periods * times)

p = 1000
r = 0.05
n = 12
t = 1
print(compound_interest(p, r, n, t))  # 1051.16
```

## Exercises

### Beginner: Calculate Interest

1. Write a script for simple/compound interest.

### Intermediate: Deploy Staking

2. Deploy RewardToken and Staking; stake from an account.

### Advanced: Claim and Compound

3. Implement claim; add auto-compound on unstake.

Starters in `/exercises/12-staking-and-interest-bearing-actions-exercises.md`.

## Advanced Topics/Extensions

- Liquid Staking: Issue stTokens for staked assets.
- Governance Staking: Vote with stakes.
- Integration: With banks (11) for interest on deposits; medical (10) for health data staking rewards.

## References and Further Reading

- Ethereum Staking: https://ethereum.org/en/staking/
- DeFi Yields: https://defillama.com/yields
- OpenZeppelin Staking: https://docs.openzeppelin.com/contracts/4.x/staking
- Pull requests welcome!

[Previous: 11-payment-solutions-for-banks.md] | [Back to Docs TOC](../README.md)