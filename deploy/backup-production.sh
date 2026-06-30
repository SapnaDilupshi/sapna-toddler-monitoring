#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/home/ec2-user/sapna-toddler-monitoring"
BACKUP_ROOT="/home/ec2-user/backups/sapna"
BACKEND_ENV_FILE="$APP_ROOT/backend/.env"
NODE_BIN="${SAPNA_NODE_INTERPRETER:-/usr/bin/node-22}"
STAMP="$(date -u +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/$STAMP"

if [[ ! -f "$BACKEND_ENV_FILE" || ! -x "$NODE_BIN" ]]; then
  echo "Missing production environment or Node.js runtime."
  exit 1
fi

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

cd "$APP_ROOT/backend"
MONGODB_URI_VALUE="$(
  "$NODE_BIN" -e 'require("dotenv").config({ quiet: true }); process.stdout.write(process.env.MONGODB_URI || "")'
)"
if [[ -z "$MONGODB_URI_VALUE" ]]; then
  echo "MONGODB_URI is not configured."
  exit 1
fi

mongodump --uri "$MONGODB_URI_VALUE" --archive="$BACKUP_DIR/mongodb.archive.gz" --gzip --quiet
unset MONGODB_URI_VALUE

pm2 save >/dev/null
cp /home/ec2-user/.pm2/dump.pm2 "$BACKUP_DIR/pm2-dump.json"
tar -C /home/ec2-user -czf "$BACKUP_DIR/source-config.tgz" \
  --exclude=sapna-toddler-monitoring/backend/node_modules \
  --exclude=sapna-toddler-monitoring/frontend/node_modules \
  --exclude=sapna-toddler-monitoring/ml-service/venv \
  --exclude=sapna-toddler-monitoring/ml-service/.venv \
  --exclude=sapna-toddler-monitoring/.git \
  sapna-toddler-monitoring

sha256sum "$BACKUP_DIR"/* > "$BACKUP_DIR/SHA256SUMS"
(
  cd "$BACKUP_DIR"
  sha256sum -c SHA256SUMS
)

echo "Production backup complete: $BACKUP_DIR"
