# Website [![Release](https://github.com/gorizond/gorizond.github.io/actions/workflows/release.yml/badge.svg)](https://github.com/gorizond/gorizond.github.io/actions/workflows/release.yml)

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Containerized build

1. Copy `.env.example` to `.env` and adjust the values:
   - `DOMAIN` single hostname served by nginx for both Docusaurus (`/`) and Rancher dashboard.
   - `RANCHER_UPSTREAM` optional Rancher backend URL (include scheme). Leave empty to disable Rancher proxying.
   - `HTTP_PORT` host port published by Docker Compose (maps to container port `80`).
2. Build the image: `docker compose build` (or `docker build -t gorizond-docs:local .`).
3. Run locally: `docker compose up -d` and open `http://localhost:${HTTP_PORT:-8080}`.
   - nginx serves the static site with gzip + long-lived cache headers for assets and proxies Rancher endpoints (`/dashboard`, `/v3`, `/v1`, `/k8s` with WebSocket upgrades) to `RANCHER_UPSTREAM` when it is set.
4. The `entrypoint.sh` script templates `nginx.conf` with your environment, validates it (`nginx -t`), and starts nginx. nginx only listens on HTTP port 80; SSL/TLS should be terminated by a Kubernetes Ingress or external load balancer.

## Published Docker image

- Registry: `ghcr.io/gorizond/gorizond.github.io`
- Tags: `latest` on `main`, short commit SHA for every push, and semver tags from `v*` releases.
- Example run:

```
docker run -p 8080:80 \
  -e DOMAIN=docs.example.com \
  -e RANCHER_UPSTREAM=https://rancher.example.com \
  ghcr.io/gorizond/gorizond.github.io:latest
```

## Helm chart

The chart is published to the OCI registry `oci://ghcr.io/gorizond/charts`.

Install with your own values:

```
helm install gorizond-site oci://ghcr.io/gorizond/charts/gorizond-site \
  --version <chart-version> \
  --values my-values.yaml
```

Example `my-values.yaml`:

```yaml
image:
  repository: ghcr.io/gorizond/gorizond.github.io
  tag: "" # defaults to the chart appVersion (matches the git tag or commit)

env:
  domain: docs.example.com
  rancherUpstream: https://rancher.example.com

rancher:
  enabled: true # direct routing via Ingress (bypasses nginx proxy)
  serviceName: rancher
  servicePort: 80
  # namespace: cattle-system # optional, when Rancher service lives elsewhere

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: docs.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - hosts: [docs.example.com]
      secretName: gorizond-docs-tls

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 200m
    memory: 256Mi

extraNginxConfig: |
  # Optional extra config for /etc/nginx/conf.d/extra.conf
  add_header X-Content-Type-Options "nosniff";
```

To upgrade later:

```
helm upgrade --install gorizond-site oci://ghcr.io/gorizond/charts/gorizond-site \
  --version <chart-version> \
  --values my-values.yaml
```

### Kubernetes (optional)

- Update `k8s/deployment.yaml` with your registry image (e.g., `ghcr.io/<org>/gorizond-docs:<tag>`) and desired domain/upstream.
- Adjust `k8s/ingress.yaml` with your host, TLS secret name, and cert-manager issuer/cluster-issuer annotation. TLS termination happens at the Ingress; nginx inside the pod only serves HTTP on port 80.
- Apply manifests: `kubectl apply -f k8s/`.
- Expose externally through the provided Ingress (or your own), ensuring cert-manager issues the certificate for the host.

## Rancher integration options

1) Via nginx proxy inside the container (`env.rancherUpstream`): nginx proxies Rancher endpoints to the upstream URL. Useful for local testing or when you need proxy headers handled inside the pod.  
2) Directly via Ingress (`rancher.enabled`): the Ingress sends `/dashboard`, `/v3`, `/v1`, and `/k8s` straight to the Rancher service (optionally in another namespace via `rancher.namespace`), bypassing nginx. Recommended for production to remove an extra hop and reduce latency.
