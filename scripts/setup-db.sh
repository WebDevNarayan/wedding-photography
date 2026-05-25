#!/usr/bin/env bash
set -e

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx dotenvx run -f .env.local -- npx tsx prisma/seed.ts

echo "Done."
