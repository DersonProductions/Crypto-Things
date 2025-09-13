#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# /examples/04-decentralized-applications-example.py
#
# This script demonstrates a basic connection to an Ethereum testnet using web3.py,
# as referenced in docs/04-decentralized-applications.md.
# It checks the connection and optionally interacts with a simple smart contract.
#
# Requirements:
# - pip install web3
# - Replace 'YOUR_INFURA_KEY' with your actual Infura API key (free signup at infura.io)
#   Full endpoint: https://sepolia.infura.io/v3/YOUR_INFURA_KEY (not browsable—use for API calls only)
#
# Quick test before running: 
# curl -X POST -H "Content-Type: application/json" \
#      --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
#      https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# (Should return something like {"jsonrpc":"2.0","id":1,"result":"0x..."} )
#
# Usage: python 04-decentralized-applications-example.py

from web3 import Web3

# Primary: Infura Sepolia testnet (replace with your key)
INFURA_URL = 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'

# Fallback: Alchemy Sepolia (alternative free provider—sign up at alchemy.com)
# ALCHEMY_URL = 'https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY'

w3 = Web3(Web3.HTTPProvider(INFURA_URL))  # Swap to ALCHEMY_URL if needed

# Check if connected
if w3.is_connected():
    print("Connected to Ethereum Sepolia testnet!")
    print(f"Current block number: {w3.eth.block_number}")
    print(f"Latest block hash: {w3.eth.block_number.hex()}")  # Hex for fun
else:
    print("Connection failed. Check your API key, URL, or try the Alchemy fallback.")
    print("Tip: Ensure /v3/ is in the URL for Infura.")

# Optional: Example of interacting with a deployed smart contract
# (Uncomment and replace with your contract details—e.g., a simple ERC-20 on Sepolia)
# ABI = [  # Minimal ABI example for a 'balanceOf' function
#     {
#         "inputs": [{"name": "account", "type": "address"}],
#         "name": "balanceOf",
#         "outputs": [{"name": "", "type": "uint256"}],
#         "stateMutability": "view",
#         "type": "function"
#     }
# ]
# ADDRESS = '0xYourContractAddressOnSepolia'
# contract = w3.eth.contract(address=ADDRESS, abi=ABI)
# result = contract.functions.balanceOf('0xYourWalletAddress').call()
# print(f"Contract balance result: {result}")

# For a full DApp, you'd integrate this with a frontend (e.g., via Flask or directly in JS).
# See exercises for extensions like fetching block numbers or signing txs.