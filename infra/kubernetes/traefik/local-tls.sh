#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

echo "🔧 Generating self-signed certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SCRIPT_DIR/tls.key" \
  -out "$SCRIPT_DIR/tls.crt" \
  -subj "/CN=client.local" \
  -addext "subjectAltName=DNS:client.local,DNS:server.local"

echo "🔧 Creating Kubernetes secret..."
kubectl create secret tls local-tls --cert="$SCRIPT_DIR/tls.crt" --key="$SCRIPT_DIR/tls.key" -n production

echo "🔧 Applying Ingress configuration..."
kubectl apply -f "$SCRIPT_DIR/ingress.yaml" -n production

echo "✅ Local HTTPS configuration complete!"
