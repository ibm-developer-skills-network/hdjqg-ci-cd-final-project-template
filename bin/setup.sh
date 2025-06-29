#!/bin/bash
echo "**************************************************"
echo " Setting up Node.js Counter Service Environment"
echo "**************************************************"

echo "*** Installing Node.js and npm"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "*** Checking Node.js and npm versions..."
node --version
npm --version

echo "*** Installing project dependencies..."
npm install

echo "*** Setting up development environment..."
echo "# Counter Service additions" >> ~/.bashrc
echo "export NODE_ENV=development" >> ~/.bashrc
echo "export PORT=8000" >> ~/.bashrc

echo "**************************************************"
echo " Node.js Counter Service Environment Setup Complete"
echo "**************************************************"
echo ""
echo "Use 'npm start' to run the service"
echo "Use 'npm run dev' for development with auto-reload"
echo "Use 'npm test' to run tests"
echo ""