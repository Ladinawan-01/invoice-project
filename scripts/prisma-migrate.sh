#!/bin/bash

# Prisma Migration Script
# This script helps run Prisma migrations

echo "🚀 Prisma Migration Runner"
echo "=========================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found in environment"
    echo "Please set DATABASE_URL in .env.local"
    exit 1
fi

echo "📋 Available commands:"
echo "1. Generate Prisma Client"
echo "2. Create new migration"
echo "3. Deploy migrations"
echo "4. Push schema (dev)"
echo "5. Open Prisma Studio"
echo ""
read -p "Select option (1-5): " option

case $option in
    1)
        echo "🔧 Generating Prisma Client..."
        npx prisma generate
        ;;
    2)
        read -p "Enter migration name: " name
        echo "📝 Creating migration: $name"
        npx prisma migrate dev --name "$name"
        ;;
    3)
        echo "🚀 Deploying migrations..."
        npx prisma migrate deploy
        ;;
    4)
        echo "⬆️  Pushing schema to database..."
        npx prisma db push
        ;;
    5)
        echo "🎨 Opening Prisma Studio..."
        npx prisma studio
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"

