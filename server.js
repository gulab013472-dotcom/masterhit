import express from "express";

const app = express();

// CONFIG
const SHARED_TOKEN = "refliefcart.shop";
const FINAL_REDIRECT_URL = "https://example.com";

app.get("/getData", (req, res) => {
  const gclid = req.query.gclid || "";
  const token = req.query.token || "";
  const timezone = req.headers["x-client-timezone"] || "unknown";

  // 🔐 Token validation (THIS works cross-origin)
  if (token !== SHARED_TOKEN) {
    return res.status(403).json({
      code: `console.warn("Unauthorized request");`
    });
  }

  console.log({
    gclid,
    timezone,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"],
    time: new Date().toISOString()
  });

  const redirectUrl = gclid
    ? `${FINAL_REDIRECT_URL}?gclid=${encodeURIComponent(gclid)}`
    : FINAL_REDIRECT_URL;

  res.json({
    code: `window.location.replace("${redirectUrl}");`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
