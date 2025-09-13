#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# /examples/05-blockchain-quorum-example.py
#
# This script demonstrates how to connect to a local Quorum node using the web3.py library.
# It is designed to work with the quorum-examples repository's Docker setup, where Quorum nodes
# expose HTTP RPC endpoints on specific host ports (e.g., node1 on http://localhost:22000).
#
# Background:
# - Quorum is an enterprise Ethereum fork, and web3.py can connect to it just like standard Ethereum nodes
#   because it uses the same JSON-RPC API.
# - In the quorum-examples Docker setup (as described in docs/05-blockchain-quorum.md), after running
#   'QUORUM_CONSENSUS=raft docker-compose up -d', the nodes are accessible via HTTP RPC.
# - Default ports (from docker-compose.yml):
#   - Node 1: http://localhost:22000 (maps to container's 8545)
#   - Node 2: http://localhost:22002
#   - And so on up to Node 7: http://localhost:22012
# - If using the manual 7nodes/raft-start.sh, nodes run locally with RPC on 8545, 8547, etc., but for Docker, use the mapped ports.
# - Note: The quorum-examples repo is deprecated but still functional for learning. For production, consider quorum-dev-quickstart.
#
# Requirements:
# - pip install web3  # Install the web3.py library if not already done.
# - Have the Quorum network running via Docker as per the doc.
# - No API key needed since it's local.
#
# Usage:
# - Run this script from your host machine: python 05-blockchain-quorum-example.py
# - It will connect to Node 1 by default. You can change the URL to connect to other nodes.
# - Expected output: Connection success message, current block number, and peer count.
#
# Troubleshooting:
# - If connection fails: Ensure the Docker network is running ('docker ps' should show quorum-examples_quorum-node1_1, etc.).
# - Check logs: docker logs quorum-examples_quorum-node1_1
# - Firewall/ports: Make sure port 22000 is not blocked.
# - For IPC alternative: If preferring IPC, you'd need to volume-mount the IPC file to host and use IPCProvider,
#   but HTTP is simpler for external scripts.
# - Quorum-specific calls: web3.py supports standard eth_ methods; for Raft-specific (e.g., raft.cluster), use w3.manager.request_blocking('raft_cluster', []).

from web3 import Web3  # Import the main Web3 class from web3.py. This is the entry point for all interactions.

# Define the RPC URL for the Quorum node.
# Here, we're connecting to Node 1's HTTP RPC endpoint exposed by Docker.
# Change this to 'http://localhost:22002' for Node 2, etc.
# If running locally without Docker (via raft-start.sh), use 'http://localhost:8545' for Node 1.
QUORUM_RPC_URL = 'http://localhost:22000'

# Create a Web3 instance connected via HTTPProvider.
# HTTPProvider sends JSON-RPC requests over HTTP to the node's RPC port.
# This is preferred for remote/localhost connections; IPCProvider is for same-machine socket access.
w3 = Web3(Web3.HTTPProvider(QUORUM_RPC_URL))

# Check if the connection is successful.
# w3.is_connected() pings the node with a simple RPC call (like net_version) to verify responsiveness.
if w3.is_connected():
    print("Successfully connected to Quorum node via HTTP RPC!")
    
    # Fetch and print the current block number.
    # w3.eth.block_number retrieves the latest block height from the chain.
    # In a new Raft network, this starts at 0 and increases as transactions are added.
    block_number = w3.eth.block_number
    print(f"Current block number: {block_number}")
    
    # Fetch and print the number of connected peers.
    # w3.net.peer_count gets the count of active peers in the network.
    # In a 7-node Raft cluster, expect 6 peers for a fully connected node.
    peer_count = w3.net.peer_count
    print(f"Number of connected peers: {peer_count}")
    
    # Optional: Quorum-specific Raft check (requires web3.py v5+ with middleware support if needed).
    # This uses a custom RPC method 'raft_cluster' to get the Raft cluster status.
    # It returns a list of nodes in the cluster, useful for verifying the setup.
    try:
        raft_cluster = w3.manager.request_blocking('raft_cluster', [])
        print("Raft cluster details:")
        print(raft_cluster)  # Outputs a list of dicts with node info (id, hostname, etc.)
    except Exception as e:
        print(f"Error fetching Raft cluster: {e}")
        print("Note: Ensure the node supports Raft consensus and the method is available.")
else:
    # If connection fails, provide debugging tips.
    print("Connection failed. Please check:")
    print("- Is the Quorum Docker network running?")
    print("- Is the RPC URL correct (http://localhost:22000 for Node 1)?")
    print("- Try curling the endpoint: curl -X POST --data '{\"jsonrpc\":\"2.0\",\"method\":\"net_version\",\"params\":[],\"id\":1}' http://localhost:22000")

# Further extensions:
# - To send transactions: Use w3.eth.account to create/sign txs.
# - For private transactions: Add 'privateFor' in tx dict (Quorum-specific).
# - Integrate with exercises: Use this connection in custom scripts to query the network.
# See docs/05-blockchain-quorum.md for more context and exercises/05-blockchain-quorum-exercises.md for practice.