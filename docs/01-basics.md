# Basics of Cryptographic Ledgers

Welcome to the first guide in the Crypto-Things repository! This document introduces the fundamental concepts of **cryptographic ledgers**. If you're new to cryptography or distributed systems, start here. We'll break down the essentials step by step, using simple explanations and examples.

By the end of this guide, you'll understand:
- What a cryptographic ledger is.
- Key building blocks like hashing and digital signatures.
- How these elements create secure, immutable records.
- Real-world applications (e.g., blockchain in cryptocurrencies).

For hands-on practice, check out the [/examples](/examples) folder after reading.

## What is a Cryptographic Ledger?
A **cryptographic ledger** is a digital system for recording transactions or data in a way that's secure, tamper-proof, and often decentralized. Unlike traditional ledgers (e.g., a bank's database), it uses cryptography to ensure:

- **Immutability**: Once data is added, it can't be changed without detection.
- **Transparency**: Anyone can verify the records (in public ledgers).
- **Security**: Protects against fraud, unauthorized access, and alterations.

The most famous example is the **blockchain**, used in Bitcoin and other cryptocurrencies. But cryptographic ledgers can apply to supply chains, voting systems, or any scenario needing trustworthy records.

### Why Use Cryptography?
Cryptography provides mathematical guarantees. It turns data into secure forms using algorithms that are hard (or impossible) to reverse without keys.

## Key Components

Let's explore the core elements. We'll use tables for quick comparisons where helpful.

### 1. Hashing
Hashing is a one-way function that converts input data (of any size) into a fixed-size string of characters, called a **hash** or **digest**. It's like a digital fingerprint.

- **Properties**:
  - Deterministic: Same input always gives the same hash.
  - Fast to compute.
  - Avalanche effect: Small input changes produce vastly different hashes.
  - Collision-resistant: Hard to find two inputs with the same hash.

- **Common Algorithms**: SHA-256 (used in Bitcoin), SHA-3.

#### Example
Input: "Hello, World!"  
Hash (SHA-256): `ed076287532e86365e841e92bfc50d8c` (truncated for brevity)

If you change it to "Hello, World?" (added "?"), the hash becomes entirely different: `a591a6d40bf420404a011733cfb3b190`.

In ledgers, hashes link entries: Each record includes the previous one's hash, creating a chain. Tampering breaks the chain.

#### Hashing Pros and Cons
| Pros | Cons |
|------|------|
| Quick verification of data integrity. | Not reversible (can't get original data from hash). |
| Detects even tiny changes. | Vulnerable to brute-force if weak algorithm used. |

### 2. Digital Signatures
These prove authenticity and ownership, like a handwritten signature but cryptographic.

- **How It Works**:
  - Uses **public-key cryptography** (asymmetric): You have a private key (secret) and public key (shared).
  - Sign: Hash the data, encrypt the hash with your private key.
  - Verify: Decrypt with public key, compare to a new hash of the data.

- **Common Algorithms**: RSA, ECDSA (Elliptic Curve Digital Signature Algorithm, used in Ethereum).

#### Example Flow
1. Alice wants to sign a transaction: "Alice sends 10 units to Bob."
2. Hash it: Gets a unique digest.
3. Sign: Encrypt digest with Alice's private key → Signature.
4. Anyone verifies: Decrypt signature with Alice's public key, match against hash of the transaction.

This ensures the transaction is from Alice and unchanged.

### 3. Blocks and Chains
Data is grouped into **blocks**, each containing:
- A list of transactions.
- A timestamp.
- The hash of the previous block.
- A nonce (for proof-of-work, explained below).

Blocks are chained via hashes, forming a **blockchain**. If you alter Block 5, its hash changes, breaking links to Block 6 and beyond.

#### Simplified Blockchain Structure

Below is an example showing blockchain structure.  both as structured text and as a diagram so the two formats match.

```
Block 1
- Hash: ABC123
- Previous Hash: 000000 (Genesis)
- Transactions: [Tx1, Tx2]
- Timestamp: 2025-09-13

Block 2
- Hash: DEF456
- Previous Hash: ABC123
- Transactions: [Tx3, Tx4]
- Timestamp: 2025-09-14

Block 3
- Hash: GHI789
- Previous Hash: DEF456
- Transactions: [Tx5, Tx6]
- Timestamp: 2025-09-15

(Example hashes and transactions are illustrative.)
```

<div class="mermaid">
graph LR
  Genesis --> Block1[Block 1<br>Hash: ABC123<br>Prev: Genesis]
  Block1 --> Block2[Block 2<br>Hash: DEF456<br>Prev: ABC123]
  Block2 --> Block3[Block 3<br>Hash: GHI789<br>Prev: DEF456]
</div>

### 4. Consensus Mechanisms
In decentralized ledgers (no single authority), nodes (computers) must agree on the ledger's state. Consensus prevents conflicts like double-spending.

- **Proof-of-Work (PoW)**: Miners solve puzzles (find nonce for valid hash). Energy-intensive but secure (e.g., Bitcoin).
- **Proof-of-Stake (PoS)**: Validators "stake" coins; chosen based on stake. More efficient (e.g., Ethereum 2.0).
- **Others**: Delegated PoS, Byzantine Fault Tolerance.

#### PoW vs. PoS

| Mechanism | Energy Use | Security | Example |
|-----------|------------|----------|---------|
| PoW | High | High (computational) | Bitcoin |
| PoS | Low | High (economic) | Cardano |

## How It All Fits Together

1. A transaction occurs (e.g., "Alice → Bob: 10 units").
2. Sign it with digital signature.
3. Broadcast to network.
4. Miners/validators group into a block, add previous hash.
5. Achieve consensus (e.g., solve PoW).
6. Add block to chain—now immutable.

This process ensures trust without a central bank.

## Common Applications

- **Cryptocurrencies**: Bitcoin ledger tracks coin ownership.
- **Supply Chain**: Track goods from farm to store (e.g., IBM Food Trust).
- **Smart Contracts**: Self-executing code on ledgers (Ethereum).
- **NFTs**: Unique digital assets on blockchains.

## Potential Challenges

- Scalability: Blockchains can be slow (e.g., Bitcoin: ~7 tx/sec).
- Energy Consumption: PoW's environmental impact.
- Security Risks: 51% attacks (control majority of network).

## Next Steps

- Try the basic hash example in [/examples/basic_hash.py](/examples/basic_hash.py).
- Move to [/docs/02-algorithms.md](/docs/02-algorithms.md) for deeper dives into specific algos.
- Practice with exercises in [/exercises](/exercises).

For more resources, see [/resources/further-reading.md](/resources/further-reading.md).

If you spot errors or want to contribute, open an issue or PR!

---

This guide is part of Crypto-Things. Licensed under MIT.