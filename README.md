# Render Redirect Server

Node.js Express server deployed on Render.

## Features
- Redirects root path to https://example.com
- Only allows requests from https://refliefcart.shop
- Runs in Japan timezone (Asia/Tokyo)
- Render-compatible

## Deploy on Render

1. Push this repo to GitHub
2. Go to https://render.com
3. Create **New Web Service**
4. Select this repo
5. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Deploy

## Endpoints

- `/` → Redirects to example.com
- `/health` → Server status and timezone
