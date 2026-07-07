# k8s-lab-webapp

Project web app nhỏ để lab local: Docker, Kubernetes, Helm Chart, Argo CD.

## Thành phần

- Backend: Node.js + Express API
- Frontend: Nginx static HTML/JS gọi API
- Dockerfile cho backend và frontend
- Kubernetes manifests thuần
- Helm chart
- Argo CD Application manifest
- Script build/load image local

## Chạy local bằng Docker Compose

```bash
docker compose up --build
```

Mở: http://localhost:8080

## Build image local cho Kubernetes

```bash
./scripts/build-images.sh
```

Với kind:

```bash
kind create cluster --name k8s-lab
./scripts/load-kind-images.sh k8s-lab
```

## Deploy bằng kubectl

```bash
kubectl create namespace lab || true
kubectl apply -n lab -f k8s/
kubectl port-forward -n lab svc/k8s-lab-frontend 8080:80
```

Mở: http://localhost:8080

## Deploy bằng Helm

```bash
helm upgrade --install k8s-lab-webapp ./helm/k8s-lab-webapp -n lab --create-namespace
kubectl port-forward -n lab svc/k8s-lab-webapp-frontend 8080:80
```

## Deploy bằng Argo CD local

Cài Argo CD trong cluster trước, sau đó sửa `argocd/application.yaml`:

- `repoURL`: repo Git local/remote của bạn
- `path`: `helm/k8s-lab-webapp`

Apply:

```bash
kubectl apply -f argocd/application.yaml
```

## Offline note

Để chạy hoàn toàn offline, máy của bạn cần có sẵn base images trước khi build:

- `node:20-alpine`
- `nginx:1.27-alpine`

Có thể save/load image:

```bash
docker save node:20-alpine nginx:1.27-alpine -o docker/offline-images/base-images.tar
docker load -i docker/offline-images/base-images.tar
```
