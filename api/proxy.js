export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { url } = req.query;

    if (!url) {
      res.status(400).json({ error: "Missing url parameter" });
      return;
    }

    const token = process.env.MONDAY_TOKEN;

    if (!token) {
      res.status(500).json({ error: "MONDAY_TOKEN not configured" });
      return;
    }

    const decodedUrl = decodeURIComponent(url);

    const response = await fetch(decodedUrl, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Accept": "image/*"
      }
    });

    if (!response.ok) {
      res.status(response.status).json({ 
        error: "Failed to fetch image",
        status: response.status
      });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") 
      ?? "image/jpeg";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(buffer);

  } catch (error) {
    res.status(500).json({ 
      error: "Proxy error",
      message: error.message 
    });
  }
}
```

5. Click **Commit changes**

---

## Also Confirm MONDAY_TOKEN Is Saved

1. Vercel → **Settings** → **Environment Variables**
2. Confirm **MONDAY_TOKEN** is listed
3. If not there — add it now

---

## Wait for Auto Deploy

Vercel will auto deploy in 30 seconds. Then test:
```
https://proposal-image-proxy.vercel.app/api/proxy
