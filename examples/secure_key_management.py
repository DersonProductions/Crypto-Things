#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# secure_key_management.py
# Demonstrates secure key generation and salted hashing for passwords.
# This is for educational purposes; in production, use secure storage like HSMs.

import secrets
import hashlib

def generate_secure_key(length=32):
    """
    Generate a secure random key using secrets module.
    
    Args:
        length (int): Byte length of the key (default 32 for 256-bit).
    
    Returns:
        bytes: Secure random bytes.
    """
    return secrets.token_bytes(length)

def secure_salted_hash(password, salt_length=16):
    """
    Create a salted hash of a password using PBKDF2.
    
    Args:
        password (str): The password to hash.
        salt_length (int): Byte length of the salt.
    
    Returns:
        bytes: Salt + hashed password.
    """
    salt = secrets.token_bytes(salt_length)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt + hashed

# Demo
if __name__ == "__main__":
    # Generate a secure key
    key = generate_secure_key()
    print(f"Secure Key (hex): {key.hex()}\n")
    
    # Hash a password securely
    password = "my_secure_password"
    hashed_pw = secure_salted_hash(password)
    print(f"Salted Hashed Password (hex): {hashed_pw.hex()}\n")
    
    # Verification example (in practice, store salt + hash and compare)
    # For demo, re-hash with same salt (extract salt)
    stored = hashed_pw
    salt = stored[:16]  # Assuming salt_length=16
    verify_hash = hashlib.pbkdf2_hmac('sha256', "my_secure_password".encode('utf-8'), salt, 100000)
    print(f"Verification: {'Success' if verify_hash == stored[16:] else 'Failure'}")
    
    # Tamper attempt
    wrong_pw_hash = hashlib.pbkdf2_hmac('sha256', "wrong_password".encode('utf-8'), salt, 100000)
    print(f"Wrong Password Verification: {'Success' if wrong_pw_hash == stored[16:] else 'Failure'}")
    
    print("\nNotes on Management:\n- Never hardcode keys.\n- Use environment variables or vaults for storage.\n- Rotate keys regularly.\n- Backup encrypted.")