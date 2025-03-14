#!/bin/sh\
echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "Running database migrations..."
npx prisma migrate deploy

echo "Generating Prisma client with TypedSQL..."
npx prisma generate
npx prisma generate --sql

echo "Starting the application..."
node dist/index.js