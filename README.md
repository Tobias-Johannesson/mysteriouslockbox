# Mysteriouslockbox

## Introduction
A basic React website hosted on AWS EC2. This document provides a step-by-step guide on setting up the project on an Ubuntu server.

## Prerequisites
- An AWS account
- Basic knowledge of terminal commands
- Access to AWS EC2 instance

## Setup Instructions

### 1. Initial Setup
First, create the React application and set up a GitHub repository.

```bash
npx create-react-app mysterious-app
cd mysterious-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <github-repo-url>
git push -u origin main

# Update and install necessary packages
sudo apt update
sudo apt install git -y
sudo apt-get install nginx -y

# Verify Nginx installation
nginx -v

# Restart Nginx to apply any configuration changes
sudo systemctl restart nginx

# Install Node.js (setting up the NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs -y

# Verify Node.js installation
node -v

# Install npm
sudo apt install npm -y

# Verify npm installation
npm -v

# Navigate to the web root directory
cd /var/www/html/

# Clone the GitHub repository
git clone <github-http-address>

# Navigate to the project directory
cd mysteriouslockbox/mysterious-app

# Install npm packages
npm install

# Start the application
npm start
```

### X. Troubleshooting
```bash
# In case of permission issues running npm install, try changing permissions via
sudo chown -R $USER:$USER /var/www/html/mysteriouslockbox
```
