#!/bin/sh
set -euo pipefail
set -x

# Ensure correct working dir
cd /app

# Wait for Postgres to be reachable (simple retry loop)
TRIES=20
SLEEP=3

DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-hostel_db}"
DB_USER="${DB_USER:-hostel_user}"

echo "Waiting for database at ${DB_HOST}:${DB_PORT}/${DB_NAME}..."
for i in $(seq 1 $TRIES); do
  if pg_isready -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" >/dev/null 2>&1; then
    echo "Database reachable."
    break
  fi
  echo "Database not ready yet ($i/$TRIES). Retrying in ${SLEEP}s..."
  sleep $SLEEP
  if [ "$i" = "$TRIES" ]; then
    echo "Database not reachable after $TRIES attempts." >&2
    exit 1
  fi
done

# Apply database schema
if [ -d prisma/migrations ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "Applying Prisma migrations with migrate deploy..."
  npx prisma migrate deploy
else
  echo "No Prisma migrations found. Running prisma db push to sync schema..."
  npx prisma db push --accept-data-loss
fi

# Start server
exec node dist/server.js

