# 05 - Blockchain Quorum Exercises

## Introduction

This file provides starter guides, hints, and sample solutions for the exercises in `docs/05-blockchain-quorum.md`. These hands-on activities reinforce setting up and interacting with a Quorum Raft network, from basic verification to customization. Focus on using Docker, command-line tools, and basic scripting.

**Prerequisites**: Docker and Docker Compose installed, Git, and basic terminal skills. For Python examples, `pip install web3`. Review the doc's setup steps first.

**Tips**:
- Work in a dedicated directory to avoid conflicts.
- Use `docker logs` for debugging.
- If stuck, check Quorum docs or GitHub issues.
- Contribute enhancements via pull requests!

## Beginner: Setup Verification

### Exercise Prompt
Clone the quorum-examples repository and start the network; confirm 7 containers are running.

### Starter Commands
Open a terminal and run:

```
# Clone the repo
git clone https://github.com/ConsenSys/quorum-examples.git
cd quorum-examples

# Start the Raft network
QUORUM_CONSENSUS=raft docker-compose up -d

# TODO: Verify containers
# Hint: Use docker ps to list them
```

### Hints
- After `docker-compose up -d`, wait 30-60 seconds for initialization.
- The network includes nodes (e.g., quorum-node1) and Tessera privacy managers.
- Expected: 7 Quorum nodes + Tessera instances (total ~14 containers, but focus on the 7 core nodes).

### Sample Solution
Verify with:

```
docker ps | grep quorum  # Should show 7 Quorum-related containers
```

If you see entries like `quorum-examples_quorum-node1_1`, etc., it's running. Stop with `docker-compose down`.

## Intermediate: Node Interaction

### Exercise Prompt
Attach to a node and list connected peers using the geth console.

### Starter Commands
Assuming the network is running from the beginner exercise:

```
# Find a node container name (e.g., quorum-examples_quorum-node1_1)
docker ps

# Attach to the geth console (replace with your container name)
docker exec -it quorum-examples_quorum-node1_1 geth attach /qdata/dd1/geth.ipc

# Inside the console:
> admin.peers  # TODO: Run this to list peers
```

### Hints
- The IPC path might vary; check container logs if `/qdata/dd1/geth.ipc` doesn't work (common in examples repo).
- In Raft, expect 6 peers (for a 7-node cluster).
- Exit console with `exit`.

### Sample Solution
In the geth console:

```
> admin.peers
```

Output: An array of peer objects with enode IDs, showing connections. If empty, check network status with `raft.cluster`.

## Advanced: Custom Network

### Exercise Prompt
Reduce the network to 4 nodes; adjust configs and restart. Verify the smaller cluster works.

### Starter Guide
Build on the 7nodes example in the repo.

1. Navigate: `cd quorum-examples/7nodes` (or copy to a new dir like `4nodes`).
2. Edit `docker-compose.yml` or scripts to limit to 4 nodes.
3. Re-init and start.

Starter script modifications (edit `raft-init.sh` and `raft-start.sh`):

```
# In raft-init.sh: Change loop from 1..7 to 1..4
for i in {1..4}; do
    # Existing init code
done

# Similarly for raft-start.sh
```

### Hints
- Update `static-nodes.json` in each node's qdata to include only 4 enodes.
- Generate new keys if needed: `geth account new --datadir qdata/dd$i`.
- For Tessera: Adjust privacy configs accordingly.
- Test: Start with `./raft-start.sh`, attach, and check `admin.peers` (should show 3 peers).
- Common issue: Ensure Raft leader election succeeds (logs show "Elected as leader").

### Sample Solution
1. Copy `7nodes` to `4nodes`.
2. Edit files:
   - `static-nodes.json`: List only 4 enode entries.
   - Scripts: Change loops to `{1..4}`.
   - `docker-compose.yml` (if using): Scale services to 4.
3. Run:
   ```
   ./raft-init.sh
   ./raft-start.sh
   ```
4. Verify: `docker ps` shows 4 nodes; attach and `admin.peers` lists 3.

This customizes for smaller setups, useful for testing.

## Further Challenges
- Add privacy: Deploy a private smart contract (see doc's Example 2).
- Python integration: Extend the doc's example to query peers via web3.py (use HTTP RPC if IPC tricky).
- Link to staking: Implement a simple validator staking sim in Python for Raft nodes (preview 12-staking-and-interest-bearing-actions.md).

[Back to Docs: 05-blockchain-quorum.md](../docs/05-blockchain-quorum.md)