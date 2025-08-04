#!/bin/bash

# Production Deployment Script for Ubuntu Server
echo "🚀 Starting production deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "📊 Running database migrations..."
npm run migration:run

# Seed initial data
echo "🌱 Seeding database..."
npm run seed

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 stop yedi-api || true
pm2 delete yedi-api || true
pm2 start dist/main.js --name "yedi-api" --instances 2

# Setup PM2 to restart on server reboot
pm2 save
pm2 startup

echo "✅ Production deployment completed!"
echo "📍 API running on port 7700"
echo "🔍 Check status: pm2 status"
echo "📋 View logs: pm2 logs yedi-api"
