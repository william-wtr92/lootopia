#!/bin/bash

NAMESPACE="monitoring"

echo "⏳ Creating namespace $NAMESPACE if it doesn't exist..."
kubectl get namespace $NAMESPACE > /dev/null 2>&1 || kubectl create namespace $NAMESPACE

echo "⏳ Adding Helm repositories..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

echo "🚀 Deploying Kube State Metrics..."
helm upgrade --install kube-state-metrics prometheus-community/kube-state-metrics -n $NAMESPACE

echo "🚀 Deploying Node Exporter..."
helm upgrade --install node-exporter prometheus-community/prometheus-node-exporter -n $NAMESPACE

echo "✅ Exporters deployed successfully!"
