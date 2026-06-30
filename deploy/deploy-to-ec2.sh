#!/usr/bin/env bash
set -euo pipefail

PEM_PATH="/Users/minadadehiwala/DAPSPractice.pem"
EC2_HOST="ec2-user@ec2-18-139-192-254.ap-southeast-1.compute.amazonaws.com"
REMOTE_ROOT="/home/ec2-user/sapna-toddler-monitoring"
LOCAL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSH_OPTS=(-i "$PEM_PATH" -o BatchMode=yes -o ConnectTimeout=15 -o ServerAliveInterval=10 -o ServerAliveCountMax=3)
SSH_RSYNC="ssh -i $PEM_PATH -o BatchMode=yes -o ConnectTimeout=15 -o ServerAliveInterval=10 -o ServerAliveCountMax=3"

node_is_supported() {
  node -e '
    const [major, minor] = process.versions.node.split(".").map(Number);
    process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1);
  ' 2>/dev/null
}

if ! command -v node >/dev/null 2>&1 || ! node_is_supported; then
  if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    # shellcheck source=/dev/null
    source "$HOME/.nvm/nvm.sh"
    nvm use 22 >/dev/null
  fi
fi

if ! command -v node >/dev/null 2>&1 || ! node_is_supported; then
  echo "Frontend build requires Node.js 22.12 or newer."
  exit 1
fi

echo "Building frontend locally"
(cd "$LOCAL_ROOT/frontend" && npm ci --prefer-offline --no-audit && npm run build)

if ssh "${SSH_OPTS[@]}" "$EC2_HOST" "test -f '$REMOTE_ROOT/deploy/backup-production.sh'"; then
  echo "Creating production backup"
  ssh "${SSH_OPTS[@]}" "$EC2_HOST" "bash '$REMOTE_ROOT/deploy/backup-production.sh'"
fi

echo "Syncing project to $EC2_HOST:$REMOTE_ROOT"
ssh "${SSH_OPTS[@]}" "$EC2_HOST" "mkdir -p '$REMOTE_ROOT'"

rsync -az --delete \
  -e "$SSH_RSYNC" \
  --exclude 'backend/node_modules' \
  --exclude 'backend/.env' \
  --exclude 'frontend/node_modules' \
  --exclude 'frontend/.env' \
  --exclude 'ml-service/.venv' \
  --exclude 'ml-service/venv' \
  --exclude 'ml-service/.generated' \
  --exclude 'ml-service/.pytest_cache' \
  --exclude 'ml-service/__pycache__' \
  --exclude 'ml-service/**/*.pyc' \
  --exclude 'diagrams/' \
  --exclude '.git' \
  --exclude '.DS_Store' \
  "$LOCAL_ROOT/" "$EC2_HOST:$REMOTE_ROOT/"

echo "Running remote update script"
ssh "${SSH_OPTS[@]}" "$EC2_HOST" "bash '$REMOTE_ROOT/deploy/remote-update.sh'"

echo "Deploy complete."
