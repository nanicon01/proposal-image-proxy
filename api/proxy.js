module.exports = async function handler(req, res) {

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

    const response = await fetch(decodeURIComponent(url), {
      method: "GET",
      headers: {
        "Authorization": token,
        "Accept": "image/*"
      }
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") 
      || "image/jpeg";

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
