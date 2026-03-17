# Signal Boss — Deployment Guide

## Your files
```
signalboss/
├── index.html          ← entry point
├── package.json        ← project config
├── vite.config.js      ← build config
├── .gitignore
└── src/
    ├── main.jsx        ← app bootstrap
    └── App.jsx         ← your entire Signal Boss app
```

---

## Step 1 — Create a GitHub repository

1. Go to **github.com** and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it: `signalboss`
4. Leave everything else as default
5. Click **Create repository**

---

## Step 2 — Upload your files to GitHub

1. On your new repository page, click **uploading an existing file**
2. Drag and drop ALL the files and folders from this zip into the upload area
   - `index.html`
   - `package.json`
   - `vite.config.js`
   - `.gitignore`
   - The entire `src/` folder (containing `main.jsx` and `App.jsx`)
3. Scroll down and click **Commit changes**

---

## Step 3 — Deploy on Vercel

1. Go to **vercel.com** and sign in (use "Continue with GitHub")
2. Click **Add New Project**
3. Find your `signalboss` repository and click **Import**
4. Vercel will auto-detect everything — don't change any settings
5. Click **Deploy**
6. Wait ~60 seconds — you'll get a live URL like `signalboss.vercel.app`

---

## Step 4 — Connect signalboss.net

### In Vercel:
1. Go to your project → **Settings** → **Domains**
2. Type `signalboss.net` and click **Add**
3. Also add `www.signalboss.net`
4. Vercel will show you DNS records to add — keep this tab open

### In GoDaddy:
1. Go to **My Products** → **DNS** next to signalboss.net
2. Find the **A record** pointing to `@` — edit it, change the IP to the one Vercel gave you
3. Find or add a **CNAME record** for `www` — point it to `cname.vercel-dns.com`
4. Save changes

### Wait:
- DNS changes take 10–30 minutes to fully propagate
- Once done, visiting signalboss.net will show your live site

---

## Updating the site later

Whenever you get an updated `App.jsx` from Claude:
1. Go to your GitHub repository
2. Click on `src/App.jsx`
3. Click the pencil icon (Edit)
4. Select all, delete, paste in the new code
5. Click **Commit changes**
6. Vercel automatically redeploys in ~30 seconds ✓

---

## Need help?
Every step above can be Googled with exact error messages.
Vercel and GitHub both have excellent free support docs.
