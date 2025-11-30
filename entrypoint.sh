#!/usr/bin/env sh
set -euo pipefail

TEMPLATE_PATH="/etc/nginx/templates/nginx.conf.template"
OUTPUT_PATH="/etc/nginx/nginx.conf"

: "${DOMAIN:=localhost}"
: "${RANCHER_UPSTREAM:=}"

export DOMAIN RANCHER_UPSTREAM

if [ ! -f "${TEMPLATE_PATH}" ]; then
    echo "nginx template not found at ${TEMPLATE_PATH}" >&2
    exit 1
fi

RANCHER_LOCATIONS=""

if [ -n "${RANCHER_UPSTREAM}" ]; then
    RANCHER_LOCATIONS="$(cat <<'EOF'
    # Rancher dashboard and APIs
    location /dashboard {
        proxy_pass ${RANCHER_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    location /v3 {
        proxy_pass ${RANCHER_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    location /v1 {
        proxy_pass ${RANCHER_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    location /k8s {
        proxy_pass ${RANCHER_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }
EOF
)"
    RANCHER_LOCATIONS="$(printf '%s' "${RANCHER_LOCATIONS}" | envsubst '${RANCHER_UPSTREAM}')"
fi

export RANCHER_LOCATIONS

envsubst '${DOMAIN} ${RANCHER_LOCATIONS}' < "${TEMPLATE_PATH}" > "${OUTPUT_PATH}"

nginx -t
exec nginx -g 'daemon off;'
