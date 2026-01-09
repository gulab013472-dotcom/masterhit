# Conditional Redirect Server (Render)

Redirects users ONLY when:
- Client timezone is Asia/Tokyo
- gclid is present and valid
- Origin is https://refliefcart.shop

## How timezone is detected
Client must send header:
x-client-timezone: Asia/Tokyo

(JavaScript Intl API on frontend)

## Deploy on Render
- Build: npm install
- Start: npm start

## Endpoints
- / → conditional redirect
- /health → status check
