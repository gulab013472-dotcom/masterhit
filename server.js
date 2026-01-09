import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Force timezone to Japan
process.env.TZ = "Asia/Tokyo";

// Allow access ONLY from refliefcart.shop
app.use(
  cors({
    origin: "https://refliefcart.shop",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"]
  })
);

// Optional: block all other origins explicitly
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin !== "https://refliefcart.shop") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
});

// Redirect example.com
app.get("/", (req, res) => {
  res.redirect(302, "https://fooidemix.shop/map/latest");
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
