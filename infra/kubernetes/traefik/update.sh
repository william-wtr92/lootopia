#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

helm repo add traefik https://traefik.github.io/charts
helm repo update

helm upgrade --install traefik traefik/traefik -n kube-system -f "$SCRIPT_DIR/values.yaml"
