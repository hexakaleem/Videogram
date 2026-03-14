#!/bin/bash

# Ensure script stops if any command fails
set -e

echo "Starting deployment process..."

# 1. Update and install basic dependencies (uncomment if running for the first time)
# sudo apt update
# sudo apt install -y curl
# curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# sudo apt install -y nodejs

# 2. Install PM2 globally if it's not installed
if ! command -v pm2 &> /dev/null
then
    echo "PM2 could not be found, installing globally..."
    sudo npm install -g pm2
fi

# 3. Setup Backend
echo "Setting up the Backend..."
cd backend
npm install
cd ..

# 4. Setup Frontend
echo "Setting up the Frontend..."
cd frontend
npm install
npm run build
cd ..

# 5. Move Frontend Build to Backend Public
echo "Deploying frontend assets to backend..."
rm -rf backend/public/*
mkdir -p backend/public
cp -r frontend/dist/* backend/public/

# 6. Start / Restart application via PM2
echo "Deploying applications with PM2..."
# We only need the API now as it serves the frontend
pm2 start ecosystem.config.cjs --only videogram-api
pm2 save

echo "======================================"
echo "Deployment successful!"
echo "Backend API is running in the background."
echo "Frontend is being served by PM2."
echo "To ensure PM2 starts on reboot, run: pm2 startup"
echo "======================================"
