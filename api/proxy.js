export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ 
      error: "Missing url parameter" 
    });
  }

  const token = process.env.MONDAY_TOKEN;

  if (!token) {
    return res.status(500).json({ 
      error: "MONDAY_TOKEN not configured" 
    });
  }

  const decodedUrl = decodeURIComponent(url);

  const imageResponse = await fetch(decodedUrl, {
    headers: {
      "Authorization": token
    }
  });

  const buffer = await imageResponse.arrayBuffer();
  const contentType = 
    imageResponse.headers.get("content-type") || "image/jpeg";

  res.setHeader("Content-Type", contentType);
  res.send(Buffer.from(buffer));
}
```

Click **Commit changes**

---

## Step 3 — Redeploy on Vercel

1. Vercel → **Deployments** tab
2. Click **3 dots** on latest → **Redeploy**
3. Wait 30 seconds

---

## Step 4 — Test Again
```
https://proposal-image-proxy.vercel.app/api/proxy
