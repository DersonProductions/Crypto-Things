#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# basic_hash.py
# A simple demonstration of hashing in a cryptographic ledger context.
# This script creates a basic hash chain for ledger entries using SHA-256.
# Run it with: python basic_hash.py

import hashlib

def create_hash(data):
    """
    Creates a SHA-256 hash of the input data.
    
    Args:
        data (str): The input string to hash.
    
    Returns:
        str: The hexadecimal digest of the hash.
    """
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

# Example ledger entries
# Entry 1: A simple transaction
entry1 = "Transaction: Alice sends 10 units to Bob"
hash1 = create_hash(entry1)
print(f"Entry 1: {entry1}")
print(f"Hash 1: {hash1}\n")

# Entry 2: Another transaction that includes the previous hash for chaining
entry2 = f"Transaction: Bob sends 5 units to Charlie | Previous Hash: {hash1}"
hash2 = create_hash(entry2)
print(f"Entry 2: {entry2}")
print(f"Hash 2: {hash2}\n")

# Demonstrate tampering detection
# If we change Entry 1 slightly, the hash changes completely
tampered_entry1 = "Transaction: Alice sends 100 units to Bob"  # Changed 10 to 100
tampered_hash1 = create_hash(tampered_entry1)
print(f"Tampered Entry 1: {tampered_entry1}")
print(f"Tampered Hash 1: {tampered_hash1}")
print("Notice how the hash is entirely different, breaking any chain!\n")

# This illustrates immutability: Altering past entries invalidates subsequent hashes.