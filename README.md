# Setting Up an Apache Web Server for Eaglercraft Launcher

## Prerequisites

Before you start, ensure you have the following:
- A server running a Unix-like OS (e.g., Ubuntu, Debian).
- Root or sudo access to the server.
- A registered domain name (`eaglercraft.dev`).
- A Cloudflare account.
- A GitHub account with access to the private repository.
- A GitHub personal access token.

## Step 1: Install Apache Web Server

1. **Update your package index:**

    ```bash
    sudo apt update
    ```

2. **Install Apache:**

    ```bash
    sudo apt install apache2
    ```

3. **Start and enable Apache to run on boot:**

    ```bash
    sudo systemctl start apache2
    sudo systemctl enable apache2
    ```

4. **Verify Apache installation:**

    Open a web browser and go to your server's IP address. You should see the Apache default welcome page.

## Step 2: Clone the Eaglercraft Launcher Repository

1. **Install Git if it's not already installed:**

    ```bash
    sudo apt install git
    ```

2. **Create a directory for your project:**

    ```bash
    sudo mkdir -p /var/www/eaglercraft
    ```

3. **Clone the private repository using your personal access token:**

    Replace `YOUR_TOKEN` with your GitHub personal access token.

    ```bash
    git clone https://YOUR_TOKEN@github.com/NightshadeNetwork/TheOrg.git /var/www/eaglercraft
    ```

4. **Set proper permissions:**

    ```bash
    sudo chown -R www-data:www-data /var/www/eaglercraft
    sudo chmod -R 755 /var/www/eaglercraft
    ```

## Step 3: Configure Apache for Eaglercraft Launcher

1. **Create a new virtual host configuration file:**

    ```bash
    sudo nano /etc/apache2/sites-available/eaglercraft.conf
    ```

2. **Add the following configuration to the file:**

    ```apache
    <VirtualHost *:80>
        ServerAdmin webmaster@eaglercraft.dev
        ServerName eaglercraft.dev
        ServerAlias www.eaglercraft.dev
        DocumentRoot /var/www/eaglercraft

        <Directory /var/www/eaglercraft>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/eaglercraft_error.log
        CustomLog ${APACHE_LOG_DIR}/eaglercraft_access.log combined

        <IfModule mod_headers.c>
            Header always set X-Content-Type-Options "nosniff"
            Header always set X-Frame-Options "SAMEORIGIN"
            Header always set X-XSS-Protection "1; mode=block"
            Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
        </IfModule>

        <IfModule mod_ssl.c>
            SSLEngine on
            SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
            SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key
        </IfModule>
    </VirtualHost>
    ```

3. **Enable the necessary Apache modules and the new virtual host:**

    ```bash
    sudo a2enmod rewrite headers ssl
    sudo a2ensite eaglercraft.conf
    ```

4. **Reload Apache to apply changes:**

    ```bash
    sudo systemctl reload apache2
    ```

## Step 4: Set Up Custom Domain with Cloudflare

1. **Add your domain to Cloudflare:**

    - Log in to your Cloudflare account.
    - Click on the **Add a Site** button.
    - Enter your domain name (`eaglercraft.dev`) and click **Begin Scan**.
    - After the scan, click **Continue Setup**.

2. **Update your domain's nameservers to Cloudflare's nameservers:**

    - Cloudflare will provide two nameservers. Update your domain registrar settings to use these nameservers.

3. **Configure DNS settings:**

    - In the Cloudflare dashboard, go to the DNS tab.
    - Add a DNS record for your server:
      - Type: A
      - Name: @
      - IPv4 address: Your server's IP address
      - TTL: Auto
      - Proxy status: Proxied (orange cloud)

4. **Enable SSL/TLS:**

    - Go to the SSL/TLS tab in the Cloudflare dashboard.
    - Select **Full** SSL mode for end-to-end encryption.

5. **Verify your setup:**

    - Wait for the DNS changes to propagate (this can take up to 24 hours).
    - Visit `eaglercraft.dev` in a web browser. You should see your Eaglercraft Launcher project served over HTTPS.

## Step 5: Update Eaglercraft Launcher Using Git

1. **Navigate to your project directory:**

    ```bash
    cd /var/www/eaglercraft
    ```

2. **Pull the latest changes from the repository:**

    ```bash
    git pull https://YOUR_TOKEN@github.com/NightshadeNetwork/TheOrg.git
    ```

3. **Verify the updates:**

    Reload your site to ensure the updates are applied correctly.

you're done!
