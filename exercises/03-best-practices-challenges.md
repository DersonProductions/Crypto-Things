# Best Practices Challenges

Welcome to the exercises for [Best Practices for Cryptographic Ledgers](/docs/03-best-practices.md)! These challenges reinforce concepts like key management, algorithm selection, secure implementation, and avoiding pitfalls. Divided by difficulty: **Easy** (recall and basics), **Medium** (application), **Hard** (design and simulation).

Use Python or your preferred language. Draw from [/examples](/examples) like `secure_key_management.py`. Solutions in collapsible sections—solve first!

## Easy Challenges

1. **Key Management Quiz**  
   List 3 best practices for storing private keys. Why is using a CSPRNG important?  
   *Hint*: Think hardware and randomness.

2. **Algorithm Choice**  
   For a new energy-efficient ledger, recommend a consensus algo and signature scheme. Justify based on pros/cons.  
   *Hint*: Consider PoS and EdDSA.

3. **Pitfalls Identification**  
   Identify 2 common pitfalls in crypto implementations and how to avoid them (e.g., timing attacks).  

## Medium Challenges

1. **Secure Key Rotation**  
   Extend [/examples/secure_key_management.py](/examples/secure_key_management.py) to simulate key rotation: Generate a new key, "migrate" a signed message by re-signing with the new key, and verify.  

2. **Salted Hash Verification**  
   Using the salted hash function from the example, store a hashed password. Write a verify function that takes input password and stored hash, extracts salt, and checks match. Test with correct/wrong passwords.

3. **Scalability Scenario**  
   Describe how to apply sharding to a simple ledger with 100 transactions. Sketch pseudocode for dividing into 2 shards and merging roots (e.g., using Merkle trees).

## Hard Challenges

1. **Audit Simulation**  
   Write a script that "audits" a hash chain: Generate a 10-entry chain, introduce a random tamper, and detect the inconsistency. Add input validation to prevent empty entries.

2. **Privacy Enhancement**  
   Implement a basic zero-knowledge proof simulator: Prove you know a secret (e.g., password hash) without revealing it. Use a commitment scheme (hash(secret + nonce)) and challenge-response. Apply to a ledger transaction.

3. **Consensus Penalty System**  
   Simulate a PoS slashing mechanism: 5 validators with stakes. Randomly flag one as "malicious," slash 10% of their stake, and redistribute to others. Run 5 rounds and print stake changes.

## Solutions

<details>
<summary>Easy 1: Key Management Quiz</summary>
Practices: Use HSMs, encrypt backups, rotate regularly. CSPRNG ensures unpredictability, preventing weak keys.
</details>

<details>
<summary>Easy 2: Algorithm Choice</summary>
Consensus: PoS (low energy). Signature: EdDSA (fast, secure). Justifies efficiency and modern security.
</details>

<details>
<summary>Easy 3: Pitfalls Identification</summary>
Pitfalls: Weak randomness (use secrets); Replay attacks (add nonces). Avoid with best practices.
</details>

<details>
<summary>Medium 1: Secure Key Rotation</summary>
Generate new keys, re-sign message with new private key, verify with new public key.
</details>

<details>
<summary>Medium 2: Salted Hash Verification</summary>

```python
def verify_password(stored_hash, input_password, salt_length=16):
    salt = stored_hash[:salt_length]
    expected_hash = stored_hash[salt_length:]
    input_hash = hashlib.pbkdf2_hmac('sha256', input_password.encode(), salt, 100000)
    return input_hash == expected_hash
```
</details>

<details>
<summary>Medium 3: Scalability Scenario</summary>
Divide txs into shards (e.g., even/odd). Compute Merkle root per shard, then global root of shard roots.
</details>

<details>
<summary>Hard 1: Audit Simulation</summary>

```python
import hashlib, random
def create_hash(data): return hashlib.sha256(data.encode()).hexdigest()

entries = [f"Entry {i}" for i in range(1,11)]
hashes = []
prev = "0"
for e in entries:
    data = e + "|" + prev
    h = create_hash(data)
    hashes.append(h)
    prev = h

# Tamper
tamper_idx = random.randint(0,9)
entries[tamper_idx] += " tampered"
# Recompute from tamper point and check mismatch
```
</details>

<details>
<summary>Hard 2: Privacy Enhancement</summary>
Commitment: hash(secret + nonce). Challenger sends random bit. Responder reveals accordingly. Verifier checks.
</details>

<details>
<summary>Hard 3: Consensus Penalty System</summary>

```python
import random
validators = {f"V{i}": 100 for i in range(1,6)}
for _ in range(5):
    malicious = random.choice(list(validators.keys()))
    slash = validators[malicious] * 0.1
    validators[malicious] -= slash
    redistribute = slash / (len(validators) - 1)
    for v in validators:
        if v != malicious:
            validators[v] += redistribute
print(validators)
```
</details>

Well done! Contribute improvements via PRs. Next: Explore resources in [/resources](/resources).