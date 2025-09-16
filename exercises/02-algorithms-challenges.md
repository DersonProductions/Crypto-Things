# ECDSA Signature Example

This script demonstrates how to generate an ECDSA key pair, sign a message (like a transaction in a cryptographic ledger), and verify the signature. It uses the `ecdsa` library, which you can install via `pip install ecdsa` if needed (though in the repo's context, assume it's available or note prerequisites).

We'll also show what happens with a tampered message to illustrate integrity checking.

```python
# ecdsa_signature.py
# Demonstration of ECDSA for signing and verifying transactions in a ledger.
# Requires: pip install ecdsa
# Run with: python ecdsa_signature.py

from ecdsa import SigningKey, VerifyingKey, SECP256k1, BadSignatureError
import hashlib

def generate_key_pair():
    """
    Generate an ECDSA private and public key pair using SECP256k1 curve.
    
    Returns:
        tuple: (private_key, public_key) as hex strings.
    """
    sk = SigningKey.generate(curve=SECP256k1)
    vk = sk.verifying_key
    return sk.to_string().hex(), vk.to_string().hex()

def sign_message(private_key_hex, message):
    """
    Sign a message using the private key.
    
    Args:
        private_key_hex (str): Hex-encoded private key.
        message (str): The message to sign.
    
    Returns:
        str: Hex-encoded signature.
    """
    sk = SigningKey.from_string(bytes.fromhex(private_key_hex), curve=SECP256k1)
    hash_msg = hashlib.sha256(message.encode('utf-8')).digest()
    signature = sk.sign(hash_msg)
    return signature.hex()

def verify_signature(public_key_hex, message, signature_hex):
    """
    Verify a signature against a message and public key.
    
    Args:
        public_key_hex (str): Hex-encoded public key.
        message (str): The original message.
        signature_hex (str): Hex-encoded signature.
    
    Returns:
        bool: True if valid, False otherwise.
    """
    vk = VerifyingKey.from_string(bytes.fromhex(public_key_hex), curve=SECP256k1)
    hash_msg = hashlib.sha256(message.encode('utf-8')).digest()
    try:
        return vk.verify(bytes.fromhex(signature_hex), hash_msg)
    except BadSignatureError:
        return False

# Main demo
if __name__ == "__main__":
    # Step 1: Generate keys
    private_key, public_key = generate_key_pair()
    print(f"Private Key (hex): {private_key}")
    print(f"Public Key (hex): {public_key}\n")

    # Step 2: Sign a transaction message
    message = "Transaction: Alice sends 10 units to Bob"
    signature = sign_message(private_key, message)
    print(f"Message: {message}")
    print(f"Signature (hex): {signature}\n")

    # Step 3: Verify the signature
    is_valid = verify_signature(public_key, message, signature)
    print(f"Verification Result: {'Valid' if is_valid else 'Invalid'}\n")

    # Step 4: Tamper with the message and verify again
    tampered_message = "Transaction: Alice sends 100 units to Bob"  # Changed amount
    is_tampered_valid = verify_signature(public_key, tampered_message, signature)
    print(f"Tampered Message: {tampered_message}")
    print(f"Tampered Verification Result: {'Valid' if is_tampered_valid else 'Invalid'}")
    print("This shows how signatures detect changes!")
```

### Output Example

When run, it might output something like:
```
Private Key (hex): [random hex]
Public Key (hex): [random hex]

Message: Transaction: Alice sends 10 units to Bob
Signature (hex): [random hex]

Verification Result: Valid

Tampered Message: Transaction: Alice sends 100 units to Bob
Tampered Verification Result: Invalid
This shows how signatures detect changes!
```

Use this script to experiment—try different messages or keys!

---

# Algorithms Challenges

Welcome to the exercises for [Algorithms in Cryptographic Ledgers](/docs/02-algorithms.md)! These challenges help reinforce concepts like hashing, digital signatures, Merkle trees, and consensus. They're divided by difficulty: **Easy** (concept recall), **Medium** (basic implementation), **Hard** (advanced application).

Work in Python (or your preferred language). Use the [/examples](/examples) folder for inspiration. Solutions are provided in collapsible sections—try solving first!

## Easy Challenges

1. **Hash Comparison**  
   Using SHA-256, hash "Ledger Entry 1" and "Ledger Entry 2". Explain why they're different and how this aids immutability.  
   *Hint*: Use Python's `hashlib`.

2. **Signature Basics**  
   Research: What's the difference between ECDSA and EdDSA? Which is better for mobile ledgers and why?  
   *Hint*: Focus on key size and computation speed.

3. **Consensus Quiz**  
   Match: PoW → High energy; PoS → Staking; PBFT → Permissioned networks.  
   Add one pro/con for each.

## Medium Challenges

1. **Build a Simple Hash Chain**  
   Extend [/examples/basic_hash.py](/examples/basic_hash.py) to create a chain of 5 entries. Each should include the previous hash. Print the full chain.  
   Then, tamper with the 3rd entry and show how it breaks subsequent hashes.

2. **Implement Merkle Root**  
   Write a function that takes a list of 4 transaction strings, hashes them (SHA-256), and computes the Merkle root.  
   Example Input: ["Tx1", "Tx2", "Tx3", "Tx4"]  
   *Code Starter*:
   ```python
   import hashlib

   def merkle_root(transactions):
       # Your code here
       pass
   ```

3. **Verify a Signature**  
   Using [/examples/ecdsa_signature.py](/examples/ecdsa_signature.py), generate a key pair and sign "Challenge Accepted". Verify it, then change the message and re-verify. Explain the result.

## Hard Challenges

1. **Simulate PoW Mining**  
   Write a script that "mines" a block: Find a nonce where hash(block_data + nonce) starts with 3 zeros. Block_data = "Block 1: Transactions XYZ". Measure time taken.  
   *Hint*: Loop incrementing nonce; use `hashlib.sha256`.

2. **ZK-Proof Intro**  
   Research and implement a simple zero-knowledge proof (e.g., prove you know a hash preimage without revealing it). Use libraries like `zkp` if available, or describe in pseudocode. Apply to a ledger privacy scenario.

3. **Custom Consensus**  
   Design a mini PoS simulator: 3 validators with stakes [100, 200, 50]. Randomly select one (weighted by stake) to "forge" a block. Run 10 rounds and tally selections.

## Solutions

<details>
<summary>Easy 1: Hash Comparison</summary>

```python
import hashlib
hash1 = hashlib.sha256(b"Ledger Entry 1").hexdigest()
hash2 = hashlib.sha256(b"Ledger Entry 2").hexdigest()
print(hash1, hash2)
```
They're different due to avalanche effect. Aids immutability by making changes detectable in chains.
</details>

<details>
<summary>Easy 2: Signature Basics</summary>
ECDSA: Elliptic curve, variable signatures. EdDSA: Deterministic, faster. EdDSA better for mobile due to efficiency.
</details>

<details>
<summary>Easy 3: Consensus Quiz</summary>
PoW: Pro - Decentralized; Con - Energy. PoS: Pro - Efficient; Con - Rich-get-richer. PBFT: Pro - Fast; Con - Less decentralized.
</details>

<details>
<summary>Medium 1: Hash Chain</summary>

Extend the script with a loop for entries. Tamper by changing one and re-hashing from there—hashes mismatch.
</details>

<details>
<summary>Medium 2: Merkle Root</summary>

```python
def merkle_root(transactions):
    if len(transactions) % 2 != 0:
        transactions.append(transactions[-1])  # Pad if odd
    hashes = [hashlib.sha256(tx.encode()).hexdigest() for tx in transactions]
    while len(hashes) > 1:
        new_hashes = []
        for i in range(0, len(hashes), 2):
            combined = hashes[i] + (hashes[i+1] if i+1 < len(hashes) else hashes[i])
            new_hashes.append(hashlib.sha256(combined.encode()).hexdigest())
        hashes = new_hashes
    return hashes[0]
```
</details>

<details>
<summary>Medium 3: Verify Signature</summary>
Follow the script. Tampered verification fails, proving integrity.
</details>

<details>
<summary>Hard 1: PoW Mining</summary>

```python
import hashlib, time
block_data = "Block 1: Transactions XYZ"
nonce = 0
start = time.time()
while True:
    data = f"{block_data}{nonce}"
    hash_val = hashlib.sha256(data.encode()).hexdigest()
    if hash_val.startswith('000'):
        print(f"Nonce: {nonce}, Hash: {hash_val}")
        break
    nonce += 1
print(f"Time: {time.time() - start}s")
```
</details>

<details>
<summary>Hard 2: ZK-Proof</summary>
Pseudocode: Commit to secret s (hash(s)). Prove knowledge by responding to challenge. In ledger: Prove transaction validity without details.
</details>

<details>
<summary>Hard 3: PoS Simulator</summary>

```python
import random
validators = {'A': 100, 'B': 200, 'C': 50}
total_stake = sum(validators.values())
selections = {'A':0, 'B':0, 'C':0}
for _ in range(10):
    rand = random.uniform(0, total_stake)
    cumulative = 0
    for v, stake in validators.items():
        cumulative += stake
        if rand <= cumulative:
            selections[v] += 1
            break
print(selections)
```
</details>

Great job! Share your solutions in issues or PRs. Next: [/docs/03-best-practices.md](/docs/03-best-practices.md) and its exercises.