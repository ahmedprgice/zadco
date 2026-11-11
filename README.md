# ZADCO website

React, TypeScript and Vite website for ZADCO Oilfield Trading.

## Local development

Use Node.js 24 and pnpm 10.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The development server runs on port 8443.

## RFQ delivery

The contact form submits to `/api/rfq`. Set `RESEND_API_KEY`, `RFQ_FROM_EMAIL` and `RFQ_TO_EMAIL` in Vercel and in `.env.local` for local testing. The sender must use a domain verified in Resend. The recipient is the inbox that handles submitted requests.

Customers can attach up to five PDF, XLSX, PNG or JPEG files with a combined limit of 4 MB. The form shows a reference number once Resend accepts the message for delivery. Replies go to the customer's submitted email address.

## Build and verify

```sh
pnpm build
pnpm test:seo
```

The build generates static HTML for the public routes, a 404 page, a sitemap and robots.txt in dist/.

## Deployment

The main branch is intended for the existing Vercel project zadco in ahmeds-projects-6847236c. Use the root directory and the checked-in vercel.json configuration.

The default configuration disables search indexing for previews. See SEO-LAUNCH.md and vercel.production.json for the separate public search launch configuration.

## Hostinger deployment

This repository includes `server.mjs` for Hostinger's Node.js web application hosting. It serves the prerendered `dist/` files and exposes the RFQ endpoint at `/api/rfq`.

Use these settings in Hostinger:

- Build command: `npm run build:production`
- Start command: `npm start`
- Node.js: 20, 22 or 24
- Environment variables: `RESEND_API_KEY`, `RFQ_FROM_EMAIL`, and `RFQ_TO_EMAIL`

The RFQ sender address must use a domain verified in Resend. After deployment, test `GET /api/rfq` and submit a real test enquiry with a small attachment before switching DNS.
