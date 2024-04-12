# MysteriousLockbox

## Introduction
A basic React website hosted on AWS EC2, configured to run securely with HTTPS. This document provides a step-by-step guide on setting up the project on an Ubuntu server.

## Prerequisites
- An AWS account
- Basic knowledge of terminal commands
- Access to an AWS EC2 instance
- Domain in Route53
- GitHub repository with a React Application

## Setup Instructions

### 1. Initial Setup
```bash
# Update and install necessary packages
sudo apt update
sudo apt install git -y
sudo apt-get install nginx -y

# Install Node.js (setting up the NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo apt install npm -y

# Verify installations
nginx -v
node -v
npm -v

sudo nano /etc/nginx/sites-available/default
# Add server block for port 80 redirect and 443 for HTTPS
# Save and exit with CTRL+X, Y, Enter
sudo nginx -t
sudo systemctl restart nginx

# Assume you have a domain in Route 53
# Create an A record in the hosted zone pointing to your EC2's IP address

# Install Certbot and AWS CLI
sudo apt update
sudo apt install certbot python3-certbot-dns-route53 -y
sudo pip install awscli --upgrade

# Configure AWS credentials for Certbot
mkdir -p ~/.aws
nano ~/.aws/credentials
# Structure your credentials file as follows:
```
```ini
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```
```bash
chmod 700 ~/.aws
chmod 600 ~/.aws/credentials

# Obtain SSL certificate
sudo -E certbot certonly --dns-route53 -d mysteriouslockbox.com -d www.mysteriouslockbox.com

# Configure Nginx to use SSL certificates
sudo nano /etc/nginx/sites-available/default
# Update server block to use SSL certificate paths
sudo nginx -t
sudo systemctl restart nginx

# Edit the cron job to include environment preservation
sudo crontab -e
# Update Certbot command to preserve environments
0 */12 * * * root sudo -E certbot renew --quiet

# Ensure only port 443 (HTTPS) is open

# Navigate to the web root directory
cd /var/www/html/

# Clone the GitHub repository
git clone https://github.com/Tobias-Johannesson/mysteriouslockbox.git

# Navigate to the project directory
cd mysteriouslockbox/mysterious-app

# Install npm packages
npm install

# Start the application
npm start
```

This part was inspired by: https://dev.to/abflatiron/deploy-a-basic-react-project-to-amazon-aws-ec2-1aoh

### 2. The React Application
...

### X. Troubleshooting
```bash
# In case of permission issues running npm install, try changing permissions via
sudo chown -R $USER:$USER /var/www/html/mysteriouslockbox
```

The following JSON outlines the necessary permissions for the DNS IAM role used by Certbot to automate DNS challenges with AWS Route 53. This role should have permissions to modify DNS records:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:GetChange",
                "route53:ChangeResourceRecordSets"
            ],
            "Resource": "arn:aws:route53:::hostedzone/*"
        },
        {
            "Effect": "Allow",
            "Action": "route53:ListHostedZones",
            "Resource": "*"
        }
    ]
}
```
