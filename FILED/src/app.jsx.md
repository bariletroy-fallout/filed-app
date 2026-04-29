# HOW TO GET YOUR APPS LIVE
### The simplest possible path. No coding experience needed.

---

## THE FASTEST WAY — LIVE IN 5 MINUTES (Free)

This works for FILED, WTNSS, PRDE, or any app Claude built you.

### Step 1 — Go to StackBlitz
Open your phone or computer browser and go to:
**stackblitz.com**

### Step 2 — Create a new React project
- Tap or click **"Start a new project"**
- Choose **React** (the blue one)
- A code editor opens with a sample app on the right

### Step 3 — Replace the code
- On the left side you'll see a file called **App.jsx** inside a folder called **src**
- Click on **App.jsx**
- Press **Ctrl+A** (or Cmd+A on Mac) to select everything
- Press **Delete** to clear it
- Open the app file Claude gave you (e.g. FILED_v4.jsx)
- Press **Ctrl+A** then **Ctrl+C** to copy all of it
- Click back in StackBlitz and press **Ctrl+V** to paste

### Step 4 — See it running
The right panel refreshes automatically. Your app is running.

### Step 5 — Share it
- Click **"Share"** at the top right of StackBlitz
- Copy the link it gives you
- That link works on any phone or computer, anywhere in the world

**That's it. You're live.**

---

## MAKING IT PERMANENT (Your own domain, $12/year)

StackBlitz links work but can expire if unused. For a permanent address:

### Step 1 — Save your code to GitHub (free)
1. Go to **github.com** → Sign up with any email
2. Click the green **"New"** button → Name it `filed-app` → Click **"Create repository"**
3. GitHub shows you a page. Look for the button that says **"uploading an existing file"** and click it
4. Download your app JSX file from Claude to your computer
5. You also need two more files. Create them as plain text files on your computer:

**File: package.json** (save this as exactly `package.json`)
```
{
  "name": "filed-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": { "start": "react-scripts start", "build": "react-scripts build" },
  "browserslist": { "production": [">0.2%"], "development": ["last 1 chrome version"] }
}
```

**File: public/index.html** (create a folder called `public`, put this inside as `index.html`)
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FILED</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

**File: src/index.js** (create a folder called `src`, put this inside as `index.js`)
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
```

**File: src/App.jsx** — this is the JSX file Claude gave you. Rename it to `App.jsx` and put it in the `src` folder.

6. Drag all of these onto the GitHub upload page
7. Click **"Commit changes"**

### Step 2 — Deploy with Vercel (free)
1. Go to **vercel.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Click **"Add New Project"** → find `filed-app` → click **"Import"**
4. Click **"Deploy"** — takes about 90 seconds
5. Vercel gives you a URL like `filed-app.vercel.app` — this is permanent

### Step 3 — Get a real domain (optional, $8–15/year)
1. Go to **namecheap.com** and search for a domain you want (e.g. `filedresearch.com`)
2. Buy it — takes 5 minutes
3. In Vercel → your project → **Settings** → **Domains** → type your domain → **Add**
4. Vercel shows you two records to add. Go back to Namecheap → **Manage** → **Advanced DNS** → add those two records exactly as shown
5. Wait 20 minutes. Your domain is live.

---

## COLLECTING PAYMENTS (Stripe)

### Setup — 20 minutes, one time
1. Go to **stripe.com** → Sign up
2. Verify your identity and add your bank account (required to receive money)
3. Click **Products** → **Add Product** → create:
   - "FILED Monthly" at $4.99/month
   - "FILED Annual" at $39/year
   - "FILED Lifetime" at $99 one time
4. Click **Payment Links** → **New** → select each product → copy the link

### Adding payment links to your app
Find this line in your app code (search for "Unlock"):
```
onClick={()=>{setIsPremium(true)...
```

Replace it with your Stripe link for each plan, like this:
```
onClick={()=>window.open('https://buy.stripe.com/YOUR_LINK_HERE','_blank')}
```

If you can't find it, just ask Claude: *"Add these Stripe payment links to my FILED app"* and paste the links. Claude will do it in one response.

---

## INSTALLING ON A PHONE (Works Right Now, Free)

Your app already works as a phone app without the App Store.

**On iPhone:**
1. Open your app URL in **Safari** (must be Safari, not Chrome)
2. Tap the share button — the box with the arrow at the bottom of the screen
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. Your app appears on the home screen exactly like a downloaded app

**On Android:**
1. Open your app URL in **Chrome**
2. Tap the three-dot menu in the top right
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Done

---

## WHEN THINGS GO WRONG

**"The app is blank or shows an error"**
The most common cause: you didn't rename the file to `App.jsx`. The file must be named exactly `App.jsx` inside the `src` folder.

**"StackBlitz shows an error about imports"**
At the very top of your App.jsx, make sure the first line is exactly:
`import { useState, useEffect, useRef } from "react";`

**"The search isn't working"**
The search uses the Anthropic API. This works automatically inside Claude's environment (claude.ai). When you deploy to your own server, you need to add an API key. Ask Claude: *"How do I add my Anthropic API key to my FILED app on Vercel?"*

**"Vercel says the build failed"**
Go to Vercel → your project → click the failed deployment → read the error log. Copy the error message and paste it to Claude. It will tell you exactly what to fix in under a minute.

**"I pushed an update to GitHub but the site didn't change"**
Vercel updates automatically within 2 minutes of a GitHub push. Wait 2 minutes and refresh. If still nothing, go to Vercel → your project → **Deployments** → click **"Redeploy"**.

---

## WHAT EVERYTHING COSTS

| Thing | Cost |
|---|---|
| StackBlitz (instant live link) | Free |
| GitHub (code storage) | Free |
| Vercel (permanent hosting) | Free |
| Domain name | $8–15/year |
| Supabase (real user accounts) | Free up to 50,000 users |
| Stripe (payments) | Free + 2.9% per transaction |
| **Total to launch** | **$0 to start, $8–15/year for a domain** |

---

## THE SHORT VERSION

If you just want it live right now:
1. Go to **stackblitz.com**
2. New project → React
3. Click App.jsx → select all → delete → paste your code
4. Click Share → copy the link
5. Done. Share that link.

Everything else above is for when you want it permanent, on your own domain, with payments.
