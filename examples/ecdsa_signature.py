#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ecdsa_signature.py
# Demonstration of ECDSA for signing and verifying transactions in a ledger.
# Requires: ecdsa library (available in the environment)
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