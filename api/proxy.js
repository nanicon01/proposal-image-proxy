export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const token = process.env.MONDAY_TOKEN;

    if (!token) {
      return res.status(500).json({ 
        error: "MONDAY_TOKEN not configured" 
      });
    }

    const imageResponse = await fetch(decodeURIComponent(url), {
      method: "GET",
      headers: {
        "Authorization": token,
        "User-Agent": "proposal-image-proxy/1.0"
      }
    });

    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({ 
        error: `Image fetch failed: ${imageResponse.statusText}` 
      });
    }

    const buffer = await imageResponse.arrayBuffer();
    const contentType = 
      imageResponse.headers.get("content-type") || "image/jpeg";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
```

4. Scroll down → Click **Commit new file**

---

## Step 3 — Confirm Structure Looks Like This
```
proposal-image-proxy/
├── README.md
└── api/
    └── proxy.js
```
If you see this you're good to go.

---

---

# PART 2 — VERCEL

## Step 4 — Delete the Old Broken Project First
1. Go to **vercel.com** and sign in
2. Find your old `monday-image-proxy` project
3. Click on it → click **Settings**
4. Scroll all the way down to the bottom
5. Click **Delete Project**
6. Type the project name to confirm
7. Click **Delete**

---

## Step 5 — Import the New Project
1. On Vercel dashboard click **Add New → Project**
2. Find **proposal-image-proxy** in your GitHub list
3. Click **Import**

---

## Step 6 — Deploy
1. Leave all settings as default
2. Click **Deploy**
3. Wait 60 seconds for the build to finish
4. You'll see confetti and a URL like:
```
   https://proposal-image-proxy-abc123.vercel.app
```
5. **Copy and save this URL**

---

## Step 7 — Add monday.com API Token
1. Click **Continue to Dashboard**
2. Click **Settings** tab
3. Click **Environment Variables** on the left
4. Add:
   - **Key:** `MONDAY_TOKEN`
   - **Value:** your monday.com API token
5. Click **Save**

**Where to find your monday API token:**
- monday.com → click your avatar bottom left
- Click **Developers**
- Click **My Access Tokens**
- Click **Show** → Copy

---

## Step 8 — Redeploy
1. Click **Deployments** tab
2. Click **3 dots (…)** on the latest deployment
3. Click **Redeploy → Redeploy**
4. Wait 30 seconds

---

## Step 9 — Test It
Open a new tab and go to:
```
https://proposal-image-proxy-abc123.vercel.app/api/proxy
