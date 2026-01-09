import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Server timezone (Render supports this)
process.env.TZ = "Asia/Tokyo";

// Allow ONLY refliefcart.shop
const ALLOWED_ORIGIN = "https://refliefcart.shop";

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "x-client-timezone"]
  })
);

// Hard block other origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Forbidden origin" });
  }
  next();
});

// Basic gclid validation (Google Ads format)
function isValidGclid(gclid) {
  if (!gclid) return false;
  return /^[A-Za-z0-9_-]{20,}$/.test(gclid);
}

// Main redirect logic
app.get("/", (req, res) => {
  const gclid = req.query.gclid || "";
  const clientTimezone = req.headers["x-client-timezone"];

  const isJapan = clientTimezone === "Asia/Tokyo";
  const validGclid = isValidGclid(gclid);

  if (isJapan && validGclid) {
    return res.redirect(302, "https://example.com");
  }

  return res.status(403).json({
    redirected: false,
    reason: {
      timezone: isJapan ? "ok" : "not_japan",
      gclid: validGclid ? "ok" : "invalid"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
