# 🌐 K3s Setup Guide

## 🚀 Prerequisites

- **Multipass**: Install with `brew install multipass`
- **kubectl**: Install with `brew install kubectl`
- **Helm**: Install with `brew install helm`

---

## 🖥️ Create the Virtual Machine

1. Create a VM with Multipass:
   ```bash
   multipass launch --name k3s-vm --mem 4G --disk 20G
   ```
2. Get the VM's IP address:
   ```bash
   multipass list
   ```

---

## 🔄 Install K3s in the VM

1. On your local machine, create the kubeconfig file and folder structure:
   ```bash
   mkdir -p ~/.kube && touch ~/.kube/k3s-config.yaml
   ```
2. Connect to the VM:
   ```bash
   multipass shell k3s-vm
   ```
3. Install K3s:
   ```bash
   curl -sfL https://get.k3s.io | sh -
   ```
4. Copy the kubeconfig inside the VM:
   ```bash
   sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/k3s-config.yaml
   ```
5. Exit the VM.
6. Copy the kubeconfig from the VM to your local machine:
   ```bash
   multipass copy-files k3s-vm:~/.kube/k3s-config.yaml ~/.kube/k3s-config.yaml
   ```
7. Update the kubeconfig with the VM's IP address.
8. Add the kubeconfig path to your `.bashrc` or `.zshrc`:
   ```bash
   export KUBECONFIG=~/.kube/k3s-config.yaml
   ```
9. Test the connection:
   ```bash
   kubectl get nodes
   ```

---

## 🛠️ Namespace Management

1. Apply the namespace:
   ```bash
   kubectl apply -f infra/kubernetes/base/namespace.yaml
   ```

---

## 🔐 Create a Docker Registry Secret

1. Create the secret:
   ```bash
   kubectl create secret docker-registry github-regcred \
     --namespace=production \
     --docker-server=ghcr.io \
     --docker-username=<github-username> \
     --docker-password=<github-token> \
     --docker-email=<your-email>
   ```
2. Verify the secret:
   ```bash
   kubectl get secret github-regcred --namespace=production
   ```

---

## 🌍 Configure `/etc/hosts` for Domain Resolution

1. Edit your `/etc/hosts` file:
   ```bash
   sudo nano /etc/hosts
   ```
2. Add the following line:
   ```
   <VM-IP> <DOMAIN>
   ```
3. Save and exit the editor.

---

## 📊 Add Prometheus as a Grafana Data Source

1. In Grafana, configure Prometheus as a data source with the following URL:
   ```text
   http://prometheus-service.monitoring.svc.cluster.local:9090
   ```

---

## 📦 Deploy Prometheus Exporters with Helm

1. Navigate to the directory:
   ```bash
   cd infra/kubernetes/monitoring/
   ```
2. Make sure the script `setup-exporters.sh` is executable:
   ```bash
   chmod +x setup-exporters.sh
   ```
3. Run the script:
   ```bash
   ./setup-exporters.sh
   ```

---

## ⚙️ Optimize Resource Usage

To avoid shutting down the VM, scale deployments as needed:

- Pause all deployments:

  ```bash
  kubectl scale deployment --all --replicas=0 -n production
  kubectl scale deployment --all --replicas=0 -n monitoring
  ```

- Resume all deployments:

  ```bash
  kubectl scale deployment --all --replicas=1 -n production
  kubectl scale deployment --all --replicas=1 -n monitoring
  ```

---

## 🛠️ Useful Commands

- List all pods:
  ```bash
  kubectl get pods -n production
  ```
- List all services:
  ```bash
  kubectl get svc -n production
  ```
- List all endpoints:
  ```bash
  kubectl get endpoints -n production
  ```
- List all deployments:
  ```bash
  kubectl get deployment -n production
  ```
- List all ingress resources:
  ```bash
  kubectl get ingress -n production
  ```
- List all secrets:
  ```bash
  kubectl get secret -n production
  ```
- View Traefik logs:
  ```bash
  kubectl logs -l app.kubernetes.io/name=traefik -n kube-system
  ```
- Restart a deployment:
  ```bash
  kubectl rollout restart deployment/<deployment-name> -n production
  ```

---

## 🔍 Additional Notes

- **Multipass VM Maintenance**: If you need to clean up unused VMs, use:
  ```bash
  multipass delete k3s-vm && multipass purge
  ```
- **Debugging**: Use `kubectl describe` on resources to get detailed information about any issues.

