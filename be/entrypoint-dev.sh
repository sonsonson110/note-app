#!/bin/sh
# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "Running database migrations..."
npx prisma migrate dev

# Generate Prisma client with TypedSQL
echo "Generating Prisma client with TypedSQL..."
npx prisma generate
npx prisma generate --sql

# Start the application
echo "Starting the application..."
npm run dev