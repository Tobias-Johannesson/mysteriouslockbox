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

sudo vim /etc/nginx/sites-available/default
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

### 2. Developing and Updating the React Application

1. **Update and Test Locally**: Make changes to your React application locally. Test the changes thoroughly to ensure functionality. You can run your application locally using:
    ```bash
    npm start
    git add .
    git commit -m "Describe your changes here"
    git push
    ```
2. **Pull Updates in the EC2**: SSH into the EC2, and run the following:
    ```bash
    cd /var/www/html/mysteriouslockbox
    sudo git pull
    ```
3. **Automate the Build**: Build the React App:
    Update the nginx to point to the correct entrypoint
    ```bash
    npm run build
    npm install --save-dev @babel/plugin-proposal-private-property-in-object
    sudo systemctl reload nginx
    ```
    
### 3. Setting Up PostgreSQL on EC2

This section provides instructions for installing and configuring PostgreSQL on the same AWS EC2 instance as your Node.js application.

#### Install and Start PostgreSQL

1. **Update and Upgrade the System**:
Ensure your system's package list and installed packages are updated.
```bash
sudo apt update
sudo apt upgrade -y
```

2. **Install PostgreSQL and Contributed Extensions**:
Install PostgreSQL along with contributed extensions that provide additional utilities and functions.
```bash
sudo apt install postgresql postgresql-contrib -y
```

3. **To start the PostgreSQL service and configure it to launch on system startup**:
Start the PostgreSQL service and configure it to automatically start on system boot.
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

4. **Configure PostgreSQL User and Database**:
Switch to the PostgreSQL user and configure the database and roles.
```bash
sudo -u postgres psql
```

Execute the following SQL commands within the PostgreSQL shell:
```bash
CREATE ROLE <USERNAME> WITH LOGIN PASSWORD '<PASSWORD>';
ALTER ROLE <USERNAME> CREATEDB;
CREATE DATABASE keys OWNER <USERNAME>;
GRANT ALL PRIVILEGES ON DATABASE keys TO <USERNAME>;
\q
```

5. **Configure Network Access**:
Edit the PostgreSQL configuration to set which IP addresses can connect.
```bash
sudo vim /etc/postgresql/14/main/postgresql.conf
```

Uncomment and modify the listen_addresses line as needed:
# Set to 'localhost' for local-only connections
listen_addresses = 'localhost'
# Set to '*' to allow external connections
# listen_addresses = '*'

6. **Configure Client Authentication**:
Configure MD5-based authentication for local connections by editing pg_hba.conf:
```bash
sudo vim /etc/postgresql/14/main/pg_hba.conf
```
Add or ensure this line exists:
local   all   all   md5

7. **Restart PostgreSQL and Test Connection**:
Apply all configuration changes by restarting PostgreSQL, then test the connection.
```bash
sudo systemctl restart postgresql
psql -U <USERNAME> -d keys
```

Replace <USERNAME> and <PASSWORD> with your actual username and a secure password. Ensure you edit paths like /etc/postgresql/14/main/... according to the PostgreSQL version installed on your system.

Then we add the Tabel
```bash
CREATE TABLE keys (
    id SERIAL PRIMARY KEY,
    key_number INT NOT NULL,
    description TEXT
);
```

Add a key and test that it works
```bash
\d keys

INSERT INTO keys (key_number) VALUES (101);
SELECT * FROM keys;
```


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

### Y. Misc
All art is generated using OpenAI and the background from some images is cleared using the adove tool at https://new.express.adobe.com/tools/remove-background.