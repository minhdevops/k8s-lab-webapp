#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${1:-kind}"
kind load docker-image k8s-lab-backend:1.0.0 --name "$CLUSTER_NAME"
kind load docker-image k8s-lab-frontend:1.0.0 --name "$CLUSTER_NAME"
