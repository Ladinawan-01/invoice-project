# Prisma Migration Script for PowerShell
# This script helps run Prisma migrations on Windows

Write-Host "🚀 Prisma Migration Runner" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  DATABASE_URL not found in environment" -ForegroundColor Yellow
    Write-Host "Please set DATABASE_URL in .env.local"
    exit 1
}

Write-Host "📋 Available commands:" -ForegroundColor Green
Write-Host "1. Generate Prisma Client"
Write-Host "2. Create new migration"
Write-Host "3. Deploy migrations"
Write-Host "4. Push schema (dev)"
Write-Host "5. Open Prisma Studio"
Write-Host ""
$option = Read-Host "Select option (1-5)"

switch ($option) {
    "1" {
        Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Blue
        npx prisma generate
    }
    "2" {
        $name = Read-Host "Enter migration name"
        Write-Host "📝 Creating migration: $name" -ForegroundColor Blue
        npx prisma migrate dev --name $name
    }
    "3" {
        Write-Host "🚀 Deploying migrations..." -ForegroundColor Blue
        npx prisma migrate deploy
    }
    "4" {
        Write-Host "⬆️  Pushing schema to database..." -ForegroundColor Blue
        npx prisma db push
    }
    "5" {
        Write-Host "🎨 Opening Prisma Studio..." -ForegroundColor Blue
        npx prisma studio
    }
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green

