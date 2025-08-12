#!/bin/sh
set -euo pipefail
set -x

# Ensure correct working dir
cd /app

# Wait for Postgres to be reachable (simple retry loop)
TRIES=20
SLEEP=3

echo "Waiting for database at ${DATABASE_URL:-unset}..."
for i in $(seq 1 $TRIES); do
  if npx prisma migrate status >/dev/null 2>&1; then
    echo "Database reachable."
    break
  fi
  echo "Database not ready yet ($i/$TRIES). Retrying in ${SLEEP}s..."
  sleep $SLEEP
  if [ "$i" = "$TRIES" ]; then
    echo "Database not reachable after $TRIES attempts." >&2
  fi
done

# Run migrations (deploy)
npx prisma migrate deploy

# Start server
exec node dist/server.js

