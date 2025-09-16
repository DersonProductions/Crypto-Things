# Algorithms in Cryptographic Ledgers

This guide builds on the [basics](/docs/01-basics.md) by exploring specific algorithms that power cryptographic ledgers. We'll dive into hashing functions, digital signature schemes, consensus protocols, and related cryptographic primitives. Each section includes explanations, use cases in ledgers, strengths/weaknesses, and code examples where applicable.

Understanding these algorithms is key to grasping how ledgers achieve security and efficiency. For practical implementation, refer to the [/examples](/examples) folder.

## Hashing Algorithms

Hashing is crucial for integrity and chaining in ledgers. Here, we cover popular ones used in blockchains.

### SHA-256 (Secure Hash Algorithm 256-bit)

- **Description**: Part of the SHA-2 family, produces a 256-bit (64 hex chars) hash. It's collision-resistant and widely used.
- **Use in Ledgers**: Bitcoin's block hashing, Merkle trees for efficient verification.
- **Strengths**: Secure against preimage attacks; fast on hardware.
- **Weaknesses**: Quantum-vulnerable in theory; not post-quantum secure.

#### SHA-256 vs. Others

| Algorithm | Output Size | Security Level | Ledger Example |
|-----------|-------------|----------------|----------------|
| SHA-256  | 256 bits   | High          | Bitcoin       |
| SHA-3    | Variable   | High (Keccak) | Ethereum (partial) |
| BLAKE3   | Variable   | Faster, secure| Some altcoins |

See [/examples/basic_hash.py](/examples/basic_hash.py) for a Python demo.

### Merkle Trees

- **Description**: A tree where leaves are data hashes, and parents are hashes of children. Enables quick verification of large datasets.
- **Use in Ledgers**: Bitcoin/Ethereum use Merkle roots in block headers to verify transactions without full data.
- **How It Works**: Proofs allow checking inclusion with logarithmic efficiency.

Example Structure (simplified):
- Leaves: Hash(Tx1), Hash(Tx2), Hash(Tx3), Hash(Tx4)
- Level 1: Hash(Hash(Tx1)+Hash(Tx2)), Hash(Hash(Tx3)+Hash(Tx4))
- Root: Hash(Level1_1 + Level1_2)

## Digital Signature Algorithms

Signatures ensure non-repudiation and authenticity.

### ECDSA (Elliptic Curve Digital Signature Algorithm)

- **Description**: Based on elliptic curve cryptography (ECC). Uses smaller keys than RSA for equivalent security.
- **Use in Ledgers**: Bitcoin/Ethereum for signing transactions.
- **Strengths**: Efficient (faster, smaller); 256-bit key ≈ 3072-bit RSA.
- **Weaknesses**: Vulnerable to side-channel attacks if poorly implemented.

#### ECDSA Signing/Verification

1. Generate key pair: Private (secret), Public (shared).
2. Sign: Compute hash(message), use private key to create signature (r, s).
3. Verify: Use public key to check if signature matches hash.

Python Snippet (using ecdsa library):
```python
from ecdsa import SigningKey, SECP256k1
import hashlib

# Generate keys
sk = SigningKey.generate(curve=SECP256k1)
vk = sk.verifying_key

# Message
message = b"Transaction: Alice sends 10 BTC"
hash_msg = hashlib.sha256(message).digest()

# Sign
signature = sk.sign(hash_msg)

# Verify
try:
    vk.verify(signature, hash_msg)
    print("Signature valid!")
except:
    print("Invalid signature.")
```

### EdDSA (Edwards-curve Digital Signature Algorithm)

- **Description**: Variant of ECC using twisted Edwards curves (e.g., Ed25519).
- **Use in Ledgers**: Solana, some privacy-focused chains.
- **Strengths**: Faster, more secure against certain attacks; deterministic signatures.
- **Weaknesses**: Less widespread than ECDSA.

## Consensus Algorithms

These ensure agreement in distributed systems.

### Proof-of-Work (PoW)

- **Description**: Nodes compete to solve a puzzle: Find nonce where hash(block + nonce) starts with many zeros (difficulty-adjusted).
- **Use in Ledgers**: Bitcoin, early Ethereum.
- **Mechanics**: Hashrate determines mining power.
- **Strengths**: Proven security; decentralized.
- **Weaknesses**: High energy use; centralization via mining pools.

#### Difficulty Adjustment

Targets average block time (e.g., 10 min for Bitcoin). If too fast, increase leading zeros required.

### Proof-of-Stake (PoS)

- **Description**: Validators chosen based on staked coins (wealth + randomness). Forge blocks instead of mining.
- **Use in Ledgers**: Ethereum 2.0, Cardano.
- **Variants**: Pure PoS, Delegated PoS (DPoS—users vote delegates).
- **Strengths**: Energy-efficient; economic incentives.
- **Weaknesses**: "Nothing at stake" attacks (mitigated by slashing).

#### PoS vs. PoW

| Aspect       | PoW                  | PoS                  |
|--------------|----------------------|----------------------|
| Resource     | Computation         | Staked Assets       |
| Energy       | High                | Low                 |
| Security     | Hashpower-based     | Economic penalties  |
| Scalability  | Limited             | Better              |

### Other Consensus

- **Practical Byzantine Fault Tolerance (PBFT)**: For permissioned ledgers (e.g., Hyperledger). Tolerates faulty nodes up to 1/3.
- **Proof-of-Authority (PoA)**: Trusted nodes; fast but less decentralized (e.g., VeChain).

## Encryption in Ledgers (Optional Layer)

While ledgers focus on integrity, some use encryption for privacy.
- **Symmetric (AES)**: Fast for data at rest; shared key.
- **Asymmetric (RSA/ECC)**: For key exchange.
- **Zero-Knowledge Proofs (ZKPs)**: Prove statements without revealing data (e.g., zk-SNARKs in Zcash).

## Security Considerations

- **Quantum Threats**: Algorithms like SHA-256/ECDSA may need upgrades (e.g., to post-quantum Lattice-based).
- **Best Practices**: Use audited libraries; avoid rolling your own crypto.

## Next Steps

- Implement ECDSA in [/examples/ecdsa_signature.py](/examples/ecdsa_signature.py) (create if needed).
- Explore advanced topics in [/docs/03-best-practices.md](/docs/03-best-practices.md).
- Test knowledge with [/exercises/02-algorithms-challenges.md](/exercises/02-algorithms-challenges.md).

For external resources, see [/resources/further-reading.md](/resources/further-reading.md).

---

This guide is part of Crypto-Things. Licensed under MIT.