# C-Hear Technologies Limited — Website Deployment Guide

> **Production site:** [www.c-hear.co.uk](https://www.c-hear.co.uk)
> **Tech stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase + Worldpay

---

## Table of Contents

1. [Environment Variables](#1-environment-variables)
2. [Local Development](#2-local-development)
3. [Production Build](#3-production-build)
4. [Option A — Deploy to Vercel (Recommended)](#4-option-a--deploy-to-vercel-recommended)
5. [Option B — Deploy to Netlify](#5-option-b--deploy-to-netlify)
6. [Option C — Deploy to Cloudflare Pages](#6-option-c--deploy-to-cloudflare-pages)
7. [Option D — Self-Hosted VPS with Docker + Nginx](#7-option-d--self-hosted-vps-with-docker--nginx)
8. [Connecting a Custom Domain](#8-connecting-a-custom-domain)
9. [Worldpay Configuration](#9-worldpay-configuration)
10. [Supabase Configuration](#10-supabase-configuration)
11. [Pre-Launch Checklist](#11-pre-launch-checklist)

---

## 1. Environment Variables

Create a `.env` file in the project root (never commit this file — it is in `.gitignore`).

```env
# ── Supabase ──────────────────────────────────────────────────────────────────
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# ── Worldpay ──────────────────────────────────────────────────────────────────
VITE_WORLDPAY_MERCHANT_CODE=YOUR_MERCHANT_CODE
VITE_WORLDPAY_INSTALLATION_ID=YOUR_INSTALLATION_ID
VITE_WORLDPAY_CLIENT_KEY=YOUR_CLIENT_KEY
```

### Where to find these values

| Variable | Location |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |
| `VITE_WORLDPAY_MERCHANT_CODE` | Worldpay Merchant Admin → Profile |
| `VITE_WORLDPAY_INSTALLATION_ID` | Worldpay Merchant Admin → Installations |
| `VITE_WORLDPAY_CLIENT_KEY` | Worldpay Merchant Admin → Installations → Client Key |

---

## 2. Local Development

**Requirements:** Node.js ≥ 20, npm ≥ 10

```bash
# Install dependencies
npm install

# Start development server
npm run dev -- --host 127.0.0.1

# Lint check
npm run lint
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 3. Production Build

```bash
npm run build
```

Output is placed in the `/dist` folder. This folder contains the complete static site ready for upload or deployment.

---

## 4. Option A — Deploy to Vercel (Recommended)

Vercel is the fastest option with automatic deploys on every Git push.

### Step-by-step

1. **Push your code to GitHub** (or GitLab / Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/c-hear-website.git
   git push -u origin main
   ```

2. **Create a Vercel account** at [vercel.com](https://vercel.com) (free tier is sufficient)

3. **Import your repository**
   - Click **"Add New Project"** → **"Import Git Repository"**
   - Select your repository

4. **Configure build settings** (Vercel usually auto-detects these):
   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

5. **Add environment variables**
   - In Vercel project → **Settings → Environment Variables**
   - Add all five variables from [Section 1](#1-environment-variables)
   - Set them for **Production**, **Preview**, and **Development** environments

6. **Deploy** — Click **"Deploy"**. Vercel will build and publish your site automatically.

7. **Add your custom domain** — See [Section 8](#8-connecting-a-custom-domain)

### Automatic deploys

Every `git push` to `main` will trigger a new production deploy automatically.

---

## 5. Option B — Deploy to Netlify

1. **Create a Netlify account** at [netlify.com](https://netlify.com)

2. **Connect your Git repository**
   - Dashboard → **"Add new site"** → **"Import an existing project"**
   - Choose GitHub and select your repository

3. **Build settings:**
   | Setting | Value |
   |---|---|
   | Build command | `npm run build` |
   | Publish directory | `dist` |

4. **Add environment variables**
   - Site settings → **Environment variables** → Add all five from [Section 1](#1-environment-variables)

5. **Add a `netlify.toml`** file in your project root for SPA routing:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

6. **Deploy** and then connect your custom domain — See [Section 8](#8-connecting-a-custom-domain)

---

## 6. Option C — Deploy to Cloudflare Pages

1. **Create a Cloudflare account** at [cloudflare.com](https://cloudflare.com)

2. **Go to Pages** → **"Create a project"** → **"Connect to Git"**

3. **Build settings:**
   | Setting | Value |
   |---|---|
   | Framework preset | None (or Vite) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. **Add environment variables** under **Settings → Environment Variables**

5. **Deploy** — Cloudflare Pages automatically handles SPA routing.

> **Note:** Cloudflare Pages is particularly good if you already manage `c-hear.co.uk` DNS through Cloudflare, as connecting your domain is a single click.

---

## 7. Option D — Self-Hosted VPS with Docker + Nginx

Use this option if you want full control over your hosting infrastructure.

### Requirements
- A VPS (DigitalOcean, Linode, AWS EC2, etc.) running Ubuntu 22.04+
- Docker and Docker Compose installed
- Your domain's DNS A record pointing to the server's IP address

### Step 1 — Install Docker on your VPS

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Step 2 — Upload your project to the server

```bash
# From your local machine — upload the source code
scp -r . user@YOUR_SERVER_IP:/var/www/c-hear-technologies

# Or clone from GitHub on the server
git clone https://github.com/YOUR_USERNAME/c-hear-website.git /var/www/c-hear-technologies
```

### Step 3 — Create your `.env` file on the server

```bash
cd /var/www/c-hear-technologies
nano .env
# Paste all five environment variables from Section 1
```

### Step 4 — Obtain SSL certificate (before starting Docker)

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d c-hear.co.uk -d www.c-hear.co.uk
```

### Step 5 — Start the application

```bash
docker compose up -d --build
```

The site will be live at `https://www.c-hear.co.uk`

### Updating the site

```bash
git pull origin main
docker compose up -d --build
```

### SSL certificate auto-renewal

```bash
# Add to crontab: renew every 60 days
echo "0 0 1 */2 * certbot renew --quiet && docker compose restart nginx" | sudo tee -a /etc/cron.d/certbot-renew
```

---

## 8. Connecting a Custom Domain

### For Vercel

1. Go to your project → **Settings → Domains**
2. Click **"Add"** and enter `www.c-hear.co.uk`
3. Vercel will show you a CNAME record to add at your domain registrar
4. Log into your domain registrar (GoDaddy, Namecheap, 123-reg, etc.)
5. Add the DNS record:
   ```
   Type:  CNAME
   Name:  www
   Value: cname.vercel-dns.com
   ```
6. For the apex domain (`c-hear.co.uk` without www), add:
   ```
   Type:  A
   Name:  @
   Value: 76.76.21.21
   ```
7. DNS propagation takes **5–30 minutes**. Vercel provisions SSL automatically.

### For Netlify

1. Site settings → **Domain management → Add custom domain**
2. Add both `c-hear.co.uk` and `www.c-hear.co.uk`
3. Update DNS at your registrar:
   ```
   Type:  CNAME
   Name:  www
   Value: YOUR_SITE_NAME.netlify.app
   ```
4. SSL is provisioned automatically via Let's Encrypt.

### For Cloudflare Pages

1. If `c-hear.co.uk` is already on Cloudflare DNS, simply click **"Set up a custom domain"** in your Pages project — it connects in seconds.
2. If not, transfer DNS to Cloudflare first for the easiest management.

---

## 9. Worldpay Configuration

Before going live, update your Worldpay settings to match your production domain:

1. Log into **Worldpay Merchant Admin** → Installations
2. Set **Payment Response URL** to:
   ```
   https://www.c-hear.co.uk/checkout
   ```
3. Set **Shopper redirect URL** to:
   ```
   https://www.c-hear.co.uk/checkout
   ```
4. Add `https://www.c-hear.co.uk` to the **allowed domains / CORS origins** list
5. Switch your installation from **Test** to **Production** mode

---

## 10. Supabase Configuration

1. In **Supabase Dashboard → Authentication → URL Configuration**:
   - Set **Site URL** to `https://www.c-hear.co.uk`
   - Add `https://www.c-hear.co.uk` to **Redirect URLs**

2. In **Supabase Dashboard → Settings → API**:
   - Confirm your anon key is correct in your production environment variables

3. Verify **Row Level Security (RLS)** is enabled on all tables before launch.

---

## 11. Pre-Launch Checklist

- [ ] All five environment variables set in hosting provider dashboard
- [ ] Worldpay switched from Test → Production mode
- [ ] Worldpay Payment Response URL updated to production domain
- [ ] Supabase Site URL updated to `https://www.c-hear.co.uk`
- [ ] DNS A/CNAME records updated at your domain registrar
- [ ] SSL certificate active (green padlock in browser)
- [ ] Test a complete checkout flow with a real card
- [ ] Test quote submission form (check `info@c-hear.co.uk` receives emails)
- [ ] Test staff portal login at `/staff-portal` with admin credentials
- [ ] Verify all 645 products load correctly
- [ ] Check site on mobile (iOS Safari + Android Chrome)
- [ ] Confirm `www.c-hear.co.uk` and `c-hear.co.uk` both redirect correctly

---

*Generated for C-Hear Technologies Limited — IT Hardware & Software Supplier, London UK*
*Contact: info@c-hear.co.uk | sales@c-hear.co.uk | 0203 807 8262*

---

# Welcome to Your Miaoda Project

## Project Info

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── context # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── layout # Layout directory
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   ├── services # Database interaction directory
│   ├── types # Type definitions directory
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

Vite, TypeScript, React, Supabase

## Development Guidelines

### How to edit code locally?

You can choose [VSCode](https://code.visualstudio.com/Download) or any IDE you prefer. The only requirement is to have Node.js and npm installed.

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: In the IDE terminal, run the command to install dependencies: npm i
# Step 5: In the IDE terminal, run the command to start the development server: npm run dev -- --host 127.0.0.1
# Step 6: if step 5 failed, try this command to start the development server: npx vite --host 127.0.0.1
```

### How to develop backend services?

Configure environment variables and install relevant dependencies.If you need to use a database, please use the official version of Supabase.

## Learn More

You can also check the help documentation: Download and Building the app（ [https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en](https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en)）to learn more detailed content.
