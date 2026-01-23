#!/bin/sh

echo "Starting Model Europa Portfolio..."

# Ensure .env file is present for Prisma commands
if [ ! -f .env ]; then
  echo "ERROR: .env file not found! Please create one based on .env.example"
  exit 1
fi

echo "Setting up database and seeding data..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
timeout=60
counter=0
while ! npx --yes prisma@6.2.1 db push --skip-generate > /dev/null 2>&1; do
  if [ $counter -ge $timeout ]; then
    echo "ERROR: Database not ready after $timeout seconds"
    exit 1
  fi
  counter=$((counter + 1))
  echo "Waiting for database... ($counter/$timeout)"
  sleep 1
done

# Check if database has been initialized before
if [ -f ".db_initialized" ]; then
  echo "Database already initialized. Skipping schema creation and seeding."
else
  echo "Database not initialized. Creating schema..."
  npx --yes prisma@6.2.1 db push --skip-generate || {
    echo "ERROR: Prisma db push failed!"
    exit 1
  }
  echo "Prisma db push completed successfully"

  echo "Running Prisma db seed..."
  node prisma/seed-simple.js || {
    echo "ERROR: Database seeding failed!"
    exit 1
  }
  echo "Database seeding completed successfully"

  # Mark database as initialized
  touch .db_initialized
  echo "Database initialization marker created."
fi

echo "Running Prisma db seed..."
node prisma/seed-simple.js || {
  echo "ERROR: Database seeding failed!"
  exit 1
}
echo "Database seeding completed successfully"

echo "Setting up file upload directories..."
# Ensure uploads directory has correct permissions (running as root)
if [ ! -d "public/uploads" ]; then
  mkdir -p public/uploads
fi
chown -R nextjs:nodejs public/uploads
chmod -R 755 public/uploads

echo "File upload directories setup complete."

echo "Database setup complete. Starting Next.js server..."
# Start the application (permissions are set correctly above)
exec node server.js
