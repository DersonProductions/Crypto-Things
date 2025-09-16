# 09 - Quorum as a Service Platform Exercises

## Introduction

This file provides starter guides, commands, hints, and sample solutions for the exercises in `docs/09-quorum-as-a-service-platform.md`. These activities reinforce cloud computing basics, containerization, and deploying Quorum on Kubernetes, from conceptual quizzes to hands-on orchestration. Start with beginner for fundamentals, then progress to practical setups.

**Prerequisites**: Docker installed, access to a terminal, and optional: a machine with at least 4GB RAM for Minikube. For Helm: Install via `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`.

**Tips**:
- Use Minikube for local testing to simulate cloud environments.
- Check Kubernetes docs for errors (e.g., `kubectl describe pod` for debugging).
- For production-like setups, consider cloud providers but start local.
- Pull requests welcome for enhancements!

## Beginner: Cloud/Container Quiz

### Exercise Prompt

Differentiate IaaS vs. PaaS; explain Docker's role in containerization.

### Starter/Solution

This is a conceptual exercise. No code; write a short summary.

Sample response:
- **IaaS (Infrastructure as a Service)**: Provides virtualized hardware like VMs, storage (e.g., AWS EC2). Pros: Full control. Cons: Manage OS/apps yourself.
- **PaaS (Platform as a Service)**: Managed runtime for apps (e.g., Google App Engine). Pros: Focus on code, auto-scaling. Cons: Less flexibility.
- **Docker's Role**: Packages apps with dependencies into portable images, enabling consistent runs across environments (dev to prod). It isolates processes without full VM overhead.

Research via cloud provider docs if needed.

## Intermediate: Minikube Setup

### Exercise Prompt

Install Minikube, deploy a sample pod, and expose it as a service.

### Starter Commands

1. Install Minikube: Follow https://minikube.sigs.k8s.io/docs/start/ (platform-specific).
2. Start: `minikube start --driver=docker`.
3. Deploy pod:

```
kubectl run sample-pod --image=nginx --port=80
```

4. TODO: Expose and access.

### Hints

- Verify: `kubectl get pods` (should show sample-pod running).
- Expose: `kubectl expose pod sample-pod --type=NodePort --port=80`.
- Access: `minikube service sample-pod` (opens browser).
- Cleanup: `kubectl delete service sample-pod; kubectl delete pod sample-pod`.

### Sample Solution

After deploy:

```
kubectl expose pod sample-pod --type=NodePort --port=80
minikube service sample-pod --url  # Get URL or auto-open
```

Browse to the URL: See Nginx welcome page. This simulates basic container deployment.

## Advanced: Quorum Helm Deploy

### Exercise Prompt

Customize and deploy Quorum via Helm; scale to 3 nodes.

### Starter Commands

1. Add repo: `helm repo add quorum https://charts.quorum.consensys.net; helm repo update`.
2. Create `values.yaml` (see examples for template, set replicas=3, consensus=raft).
3. Install:

```
helm install my-quorum quorum/quorum -f values.yaml
```

4. TODO: Verify and scale.

### Hints

- Verify: `kubectl get pods` (look for 3 Quorum pods ready).
- Scale: Edit values.yaml replicas=3, then `helm upgrade my-quorum quorum/quorum -f values.yaml`.
- Access RPC: `kubectl port-forward svc/my-quorum-geth-rpc 8545:8545` (test with curl).
- Uninstall: `helm uninstall my-quorum`.

### Sample Solution

With customized values.yaml (replicas=3, consensus=raft):

```
helm upgrade --install my-quorum quorum/quorum -f values.yaml
kubectl get pods -l app.kubernetes.io/name=quorum  # Shows 3 pods
```

Connect via web3.js to localhost:8545 after port-forward. This creates a scalable QaaS prototype.

## Further Challenges

- Integrate QNM: Deploy QNM operator and apply a QuorumNode CRD.
- Cloud Migration: Adapt to AWS EKS (create cluster, install Helm chart).
- Staking Service: Deploy a staking contract pod on the Quorum cluster (link to 12-staking-and-interest-bearing-actions.md).

[Back to Docs: 09-quorum-as-a-service-platform.md](../docs/09-quorum-as-a-service-platform.md)