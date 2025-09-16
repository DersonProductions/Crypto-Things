# 04 - Decentralized Applications Exercises

## Introduction

This file contains starter code, hints, and partial solutions for the exercises outlined in `docs/04-decentralized-applications.md`. The goal is to reinforce your understanding of DApps through hands-on practice. Work through them progressively—beginner for basics, intermediate for setup, and advanced for building.

**Prerequisites**: Python 3.x installed, along with `web3` library (`pip install web3`). Familiarity with earlier docs (e.g., 01-basics.md for signatures).

**Tips**:
- Run code in a virtual environment to avoid conflicts.
- For blockchain interactions, use free testnets like Sepolia (get an API key from Infura or Alchemy).
- Debug using print statements or tools like pdb.
- Contribute improvements via pull requests!

## Beginner: Research and Summarize

### Exercise Prompt

List 3 real-world DApps and their blockchains. Explain one benefit each.

### Starter/Solution

This is a research-based exercise. No code needed, but here's a sample response to guide you:

1. **Uniswap** on Ethereum: A decentralized exchange for swapping tokens. Benefit: Eliminates intermediaries, reducing fees and enabling permissionless trading.
2. **Axie Infinity** on Ronin (Ethereum sidechain): A play-to-earn game with NFTs. Benefit: Allows users to own and monetize in-game assets truly.
3. **Filecoin** on its own blockchain: Decentralized storage network. Benefit: Provides censorship-resistant file storage with economic incentives for providers.

Research more using resources like DAppRadar or CoinMarketCap. Write your list in a Markdown file and compare.

## Intermediate: Setup and Connect

### Exercise Prompt

Install `web3.py` and modify the example to fetch the latest block number from Ethereum mainnet. Expected output: A number > 20,000,000.

### Starter Code

Start with this script (based on the doc's example). You'll need an Infura or Alchemy API key—sign up for free.

```python
from web3 import Web3

# Replace with your API key
INFURA_URL = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'

# Connect to Ethereum mainnet
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Check connection
if w3.is_connected():
    print("Connected to Ethereum mainnet!")
else:
    print("Connection failed. Check your API key or URL.")
    exit()

# TODO: Fetch and print the latest block number
# Hint: Use w3.eth.block_number
```

### Hints

- After connecting, access the block number with `w3.eth.block_number`.
- Expected output example (as of 2025): Something like 21000000 or higher.
- If you get rate-limited, switch to a testnet like Sepolia for practice.

### Sample Solution

Add this line after the connection check:

```python
latest_block = w3.eth.block_number
print(f"Latest block number: {latest_block}")
```

Run it: Should print "Latest block number: [large number]".

## Advanced: Build a Mini-DApp

### Exercise Prompt

Extend the simulation to include user authentication (e.g., via mock signatures from 01-basics.md). Prevent double-voting.

### Starter Code

Build on the simple voting DApp simulation from the doc. Add a user system with mock signatures for authenticity.

```python
import hashlib  # For mock signatures (from 01-basics.md)

class SimpleDApp:
    def __init__(self):
        self.votes = {'Option A': 0, 'Option B': 0}
        self.voted_users = set()  # To prevent double-voting
    
    def generate_mock_signature(self, message):
        """Mock signature: Hash the message as a simple 'signature'."""
        return hashlib.sha256(message.encode()).hexdigest()
    
    def verify_signature(self, message, signature):
        """Verify by re-hashing."""
        return self.generate_mock_signature(message) == signature
    
    def vote(self, option, user_id, signature):
        # TODO: Implement verification and double-vote prevention
        # 1. Create a message like f"Vote for {option} by {user_id}"
        # 2. Verify signature
        # 3. Check if user_id has voted
        # 4. If valid, add vote and mark as voted
        pass
    
    def get_results(self):
        return self.votes

# Usage example (to test)
dapp = SimpleDApp()
user_id = "user123"
message = f"Vote for Option A by {user_id}"
sig = dapp.generate_mock_signature(message)
# Try voting: dapp.vote('Option A', user_id, sig)
```

### Hints

- Message for signing: Combine option and user_id to prevent replay attacks.
- Use `self.voted_users.add(user_id)` after successful vote.
- Raise errors for invalid signature or repeat votes (e.g., ValueError).
- For real-world, use ECDSA from `ecdsa` library (as in 01-basics.md).

### Sample Solution

Implement the `vote` method like this:

```python
    def vote(self, option, user_id, signature):
        if option not in self.votes:
            raise ValueError("Invalid option")
        
        message = f"Vote for {option} by {user_id}"
        if not self.verify_signature(message, signature):
            raise ValueError("Invalid signature")
        
        if user_id in self.voted_users:
            raise ValueError("User has already voted")
        
        self.votes[option] += 1
        self.voted_users.add(user_id)
```

Test it:
- Generate sig and vote once: Succeeds.
- Vote again with same user_id: Raises error.

This simulates a secure, decentralized voting mechanism. Extend to actual blockchain by deploying as a smart contract (see 06-smart-contracts.md).

## Further Challenges

- Integrate with real Ethereum: Replace mock sig with wallet signing using `eth_account`.
- Add staking: Require users to "stake" mock tokens to vote (link to 12-staking-and-interest-bearing-actions.md).
- Visualize results: Use matplotlib to plot vote counts.

[Back to Docs: 04-decentralized-applications.md](../docs/04-decentralized-applications.md)