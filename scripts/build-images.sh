#!/usr/bin/env bash
set -euo pipefail

docker build -t k8s-lab-backend:1.0.0 ./backend
docker build -t k8s-lab-frontend:1.0.0 ./frontend

echo "Built images:"
docker images | grep 'k8s-lab-'
