# Junket 🏔️
### Your weekend, planned.

This is the complete source code for Junket — an AI-powered weekend itinerary generator. Follow these steps exactly and you'll have a live website.

**Time required:** 30–45 minutes  
**Cost:** ~$12/yr for a domain (optional). Hosting and API are free to start.

---

## What you need before starting

- A computer (Mac or Windows)
- A credit card for the Anthropic API (you won't be charged until you use it; $5 gets you hundreds of itineraries)
- An email address

You do NOT need to know how to code.

---

## Part 1 — Install the tools (one time only)

### 1A. Install Node.js
Node.js lets your computer run the project locally.

1. Go to [nodejs.org](https://nodejs.org)
2. Click the **LTS** version (the left button) to download
3. Open the downloaded file and click through the installer
4. To confirm it worked: open Terminal (Mac: press `Cmd+Space`, type "Terminal") or Command Prompt (Windows: press `Win+R`, type "cmd") and run:
   ```
   node --version
   ```
   You should see something like `v20.11.0`. If you do, you're good.

### 1B. Install Git
Git is how you put code on GitHub.

- **Mac:** Open Terminal and run `git --version`. If it prompts you to install developer tools, click Install.
- **Windows:** Download from [git-scm.com](https://git-scm.com/download/win) and run the installer (all defaults are fine).

### 1C. Create a GitHub account
1. Go to [github.com](https://github.com) and sign up (free)
2. Verify your email

### 1D. Create a Vercel account
1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up → Continue with GitHub**
3. Authorize Vercel to access your GitHub

### 1E. Get an Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up with your email
3. Go to **Settings → API Keys → Create Key**
4. Name it "junket" and click Create
5. **Copy the key now** — it starts with `sk-ant-` and you won't be able to see it again
6. Paste it somewhere safe temporarily (Notes app is fine)
7. Add a credit card under **Billing → Add payment method** — you won't be charged until you use it

---

## Part 2 — Put the code on GitHub

### 2A. Unzip this project
Unzip the `junket.zip` file you downloaded. You should see a folder called `junket` containing files like `package.json`, `README.md`, etc.

### 2B. Push to GitHub

Open Terminal (Mac) or Command Prompt (Windows) and run these commands one at a time. Replace `/path/to/junket` with the actual path to your unzipped folder (e.g. `/Users/mike/Downloads/junket` on Mac or `C:\Users\mike\Downloads\junket` on Windows).

```bash
cd /path/to/junket
git init
git add .
git commit -m "Initial commit"
```

Now create a GitHub repository:
1. Go to [github.com/new](https://github.com/new)
2. Name it `junket`
3. Keep it **Private**
4. **Do not** check any of the "Initialize" boxes
5. Click **Create repository**

GitHub will show you a page with commands. Run the ones under **"…or push an existing repository"**:
```bash
git remote add origin https://github.com/YOURUSERNAME/junket.git
git branch -M main
git push -u origin main
```

Refresh your GitHub page — you should see all the files.

---

## Part 3 — Deploy on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New → Project**
3. Under "Import Git Repository" find `junket` and click **Import**
4. Vercel will detect the framework as **Vite** automatically ✓
5. Click **Environment Variables** to expand that section and add:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (paste your key from Part 1E)
   - Click **Add**
6. Click **Deploy**

Wait about 90 seconds. Vercel will give you a live URL like:
```
https://junket-abc123.vercel.app
```

**Open it. Type a destination. It should work.**

---

## Part 4 (optional) — Add a custom domain

1. Buy a domain at [namecheap.com](https://namecheap.com) (~$12/yr)
   - Good options: `getjunket.com`, `weekendjunket.com`, `planejunket.com`
2. In Vercel, go to your project → **Settings → Domains**
3. Type your domain and click **Add**
4. Vercel shows you two DNS records to add. Copy them.
5. Go to Namecheap → **Domain List → Manage → Advanced DNS**
6. Delete any existing A or CNAME records, then add the two records from Vercel
7. Wait 10–30 minutes for DNS to propagate. Your domain is now live.

---

## Part 5 (optional) — Run locally for development

If you want to preview changes before deploying:

```bash
# Install dependencies (only needed once)
npm install

# Create a local environment file with your API key
echo 'ANTHROPIC_API_KEY=sk-ant-your-key-here' > .env.local

# Start local dev server (runs both frontend + API)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** Use `npm run dev` (not `vite`) — this uses `vercel dev` which runs the API routes locally too. If it asks you to link to a Vercel project, follow the prompts.

---

## Troubleshooting

**"Command not found: node"**  
Node isn't installed or didn't install correctly. Repeat Step 1A.

**"Permission denied" when running git commands**  
On Mac, run `sudo git ...` and enter your computer password.

**Vercel deploy fails**  
Check the build logs in Vercel for the error. Most common cause: typo in the environment variable name. It must be exactly `ANTHROPIC_API_KEY`.

**"Couldn't load weekend options" on the live site**  
Your API key isn't set correctly. Go to Vercel → your project → **Settings → Environment Variables**, confirm `ANTHROPIC_API_KEY` is there, then go to **Deployments → Redeploy**.

**The site loads but looks broken**  
Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows).

---

## Project structure (for reference)

```
junket/
├── api/
│   └── chat.js        ← Serverless function — calls Anthropic, keeps your API key secret
├── src/
│   ├── App.jsx        ← The entire React frontend
│   ├── index.css      ← All styles
│   └── main.jsx       ← Entry point
├── public/            ← Static assets (empty for now)
├── index.html         ← HTML shell
├── package.json       ← Dependencies
├── vite.config.js     ← Build config
└── vercel.json        ← Vercel routing + build settings
```

---

## How it works (plain English)

1. You type a destination and hit enter
2. The frontend sends it to `/api/chat` — a tiny function running on Vercel's servers
3. That function calls Anthropic's API using your secret key (which never touches the browser)
4. Claude returns 3 weekend vibe options as structured data
5. You pick one → another API call builds the full Saturday + Sunday itinerary
6. Each stop has a place name, description, and local tip

**Cost per itinerary:** ~$0.01–0.03. At 100 users/day that's $1–3/day.

---

## What to build next

- **Shareable links** — biggest growth mechanic; people text itineraries to friends
- **Email capture** — "Save my Junket" before they leave
- **Local knowledge layer** — a curated list of your actual Berkshires + Boston picks injected into the prompt
- **Sponsored spots** — charge local businesses for featured placement
- **Mobile app** — React Native reuses all this logic
