#!/usr/bin/env bash
# /examples/09-quorum-as-a-service-platform-example.sh
#
# This Bash script demonstrates a basic deployment of Quorum as a Service (QaaS) on a local Kubernetes cluster using Minikube and Helm.
# It starts Minikube, adds the Quorum Helm repository, installs a single-node Quorum cluster with Raft consensus, and verifies the pods.
# This is a simplified example for educational purposes—adapt for production with multi-node setups, persistence, and security.
#
# Best Practices for Linux Shell Scripts Incorporated:
# - Shebang: Uses #!/usr/bin/env bash for portability across systems (finds bash in PATH).
# - Error Handling: set -euo pipefail to exit on errors, undefined variables, and pipeline failures.
# - Comments: Extensive inline comments explaining each step.
# - Variables: Use uppercase for constants, quotes to prevent word splitting.
# - Readability: Consistent indentation, short lines, and echo statements for user feedback.
# - Idempotency: Checks if commands succeed before proceeding; avoids destructive actions.
# - Security: No hard-coded secrets; in prod, use secrets management (e.g., Kubernetes secrets).
# - Portability: Assumes common tools (minikube, helm, kubectl) are installed; add checks if needed.
# - Logging: Use echo for output; in complex scripts, redirect to logs.
#
# Prerequisites:
# - Minikube, Helm, and kubectl installed (e.g., via brew on Mac, apt on Linux).
# - Docker running (Minikube uses it as driver).
# - Run as non-root; sudo not needed for these commands.
#
# Usage: bash 09-quorum-as-a-service-platform-example.sh
# Cleanup: minikube delete; helm uninstall my-quorum
#
# As of September 13, 2025, verify URLs/charts are current (Consensys may update).

set -euo pipefail  # Enable strict mode: Exit on error (-e), undefined vars (-u), and pipe failures (pipefail).

# Constants for configuration (easy to customize).
MINIKUBE_DRIVER="docker"  # Driver: docker, virtualbox, etc. Docker is default and efficient.
QUORUM_RELEASE_NAME="my-quorum"  # Helm release name.
QUORUM_CHART="quorum/quorum"  # Chart name.
CONSENSUS="raft"  # Consensus: raft, ibft, etc.
REPLICAS=1  # Start with 1 for simplicity; scale later.

echo "Starting Minikube cluster..."
# minikube start: Creates a local K8s cluster. --driver specifies the VM driver.
# Best practice: Use --driver for consistency; check if already running to avoid recreation.
if ! minikube status | grep -q "Running"; then
  minikube start --driver="$MINIKUBE_DRIVER"
else
  echo "Minikube already running; skipping start."
fi

echo "Adding Quorum Helm repository..."
# helm repo add: Registers the Consensys chart repo for Quorum deployments.
# helm repo update: Ensures latest charts are fetched.
# Best practice: Check if repo exists first to avoid duplicates.
if ! helm repo list | grep -q "quorum"; then
  helm repo add quorum https://charts.quorum.consensys.net
fi
helm repo update

echo "Installing Quorum via Helm..."
# helm install: Deploys the chart with overrides (--set).
# --set: Inline config for consensus and replicas (use -f values.yaml for complex setups).
# Best practice: Use --dry-run first for validation; handle existing releases with upgrade.
helm upgrade --install "$QUORUM_RELEASE_NAME" "$QUORUM_CHART" \
  --set consensus="$CONSENSUS" \
  --set replicas="$REPLICAS"

echo "Verifying Quorum pods..."
# kubectl get pods: Lists pods; -w for watch mode (optional for real-time).
# Best practice: Add timeouts or loops to wait for readiness (e.g., until pods are Running).
kubectl get pods -l app.kubernetes.io/name=quorum  # Filter by label for Quorum pods.

echo "Deployment complete! Access Quorum RPC via port-forward: kubectl port-forward svc/my-quorum-geth-rpc 8545:8545"
echo "To clean up: helm uninstall $QUORUM_RELEASE_NAME && minikube delete"

# End of script. In advanced versions, add functions for modularity or arg parsing with getopts.