/* global process, Buffer */

export default async function handler(req, res) {
  const backendUrl = process.env.URL_BACKEND;

  if (!backendUrl) {
    return res.status(500).json({
      error: "URL_BACKEND is not defined",
    });
  }

  const path = req.url.replace(/^\/api\/proxy/, "");
  const targetUrl = `${backendUrl}${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
    });

    const body = await response.arrayBuffer();

    res.status(response.status);

    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();

      if (
        lowerKey !== "content-encoding" &&
        lowerKey !== "transfer-encoding" &&
        lowerKey !== "connection"
      ) {
        res.setHeader(key, value);
      }
    });

    res.send(Buffer.from(body));
  } catch (error) {
    res.status(500).json({
      error: "Proxy request failed",
      details: error.message,
    });
  }
}
