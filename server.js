import express from "express";

const app = express();

const FINAL_REDIRECT_URL = "https://example.com";
const JAPAN_TIMEZONE = "Asia/Tokyo";
const ALLOWED_ORIGIN = "https://refliefcart.shop";

/* ------------------ Helpers ------------------ */

function isValidGclid(gclid) {
  return (
    typeof gclid === "string" &&
    gclid.length >= 20 &&
    gclid.length <= 150 &&
    /^[A-Za-z0-9_-]+$/.test(gclid)
  );
}

/* ------------------ CORS ------------------ */

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-client-timezone");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.options("/getData", (req, res) => {
  return res.sendStatus(204);
});

/* ------------------ Route ------------------ */

app.get("/getData", (req, res) => {
  const rawGclid = req.query.gclid;
  const timezone = req.headers["x-client-timezone"] || "";
  const country =
    req.headers["cf-ipcountry"] || // Cloudflare
    req.headers["x-vercel-ip-country"] || // Vercel
    "";

  // Reject array-based attacks
  if (Array.isArray(rawGclid)) {
    return res.json({ code: `console.log("No redirect: invalid gclid");` });
  }

  const gclid = String(rawGclid || "").trim();

  // ❌ Invalid gclid
  if (!isValidGclid(gclid)) {
    return res.json({ code: `console.log("No redirect: invalid gclid");` });
  }

  // ❌ Not Japan
  if (country !== "JP" || timezone !== JAPAN_TIMEZONE) {
    return res.json({
      code: `console.log("No redirect: country=${country}, timezone=${timezone}");`
    });
  }

  // ✅ Redirect
  const redirectUrl =
    `${FINAL_REDIRECT_URL}?gclid=${encodeURIComponent(gclid)}`;

  return res.json({
    redirect: redirectUrl
  });
});

/* ------------------ Server ------------------ */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
