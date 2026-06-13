# NOR PERFUME — Customer Account API Setup Guide

This guide explains how to wire the **Shopify Customer Account API** to the
custom `/account`, `/orders`, `/login`, and `/auth/callback` pages built into
this storefront.

The site uses the official OAuth 2.0 PKCE flow — no passwords ever touch our
servers. Login is hosted by Shopify, and the token is used to call the
Customer Account API directly from the browser.

---

## 1. Create a Customer Account API client (in Shopify Admin)

1. Open Shopify Admin → **Settings → Customer accounts**.
2. Make sure **New customer accounts** is selected (the legacy "Classic" mode
   does **not** expose the Customer Account API).
3. Scroll to **Customer Account API** → click **Manage**.
4. Under **Application setup**, copy your **Shop ID** — you should see the URL
   pattern `shopify.com/{shop_id}/account/...`.
5. Under **Headless** / **Application setup**, click **Create new client** (or
   open the existing one) and capture the **Client ID** (a UUID).

## 2. Add the redirect URIs

In the same Customer Account API client settings, add the following
**JavaScript origins / Callback URIs**:

| Environment | Callback URI |
|---|---|
| Local dev | `http://localhost:8080/auth/callback` (use whatever port Vite prints) |
| Lovable preview | `https://id-preview--<your-project-id>.lovable.app/auth/callback` |
| Production | `https://www.norperfume.com/auth/callback` (replace with your domain) |

Also add the **Logout URI** for each environment (same path as the origin,
e.g. `https://www.norperfume.com`).

## 3. Paste the credentials in the codebase

Open **`src/lib/shopify/client.ts`** and update the constants inside
`DEFAULT_SHOPIFY_CONFIG`:

```ts
const DEFAULT_SHOPIFY_CONFIG = {
  domain: "nor-perfume-4.myshopify.com",
  apiVersion: "2024-04",
  accessToken: "<storefront-api-token>",
  publicClientId: "<PASTE CUSTOMER ACCOUNT API CLIENT ID HERE>",
  shopId: "<PASTE SHOP ID HERE>",
};
```

The Customer Account API itself uses its own version, set in
**`src/lib/shopify/customer-account.ts`**:

```ts
const CUSTOMER_API_VERSION = "2024-10"; // bump as Shopify releases new versions
```

## 4. (Optional) Override via environment variables

For multi-environment deploys, prefer `.env` overrides so prod and preview can
use different clients. Add to `.env.local` (and Vercel env vars):

```
VITE_SHOPIFY_DOMAIN=nor-perfume-4.myshopify.com
VITE_SHOPIFY_ACCESS_TOKEN=<storefront-api-token>
```

If you want the Customer Account `publicClientId` and `shopId` overridable
too, extend `SHOPIFY_CONFIG` in `client.ts` to read them the same way.

## 5. How the flow works

1. User clicks the **Account** icon → routed to `/login`.
2. `/login` calls `beginLogin()` → generates PKCE verifier + challenge,
   stores them in `sessionStorage`, redirects to Shopify's hosted login.
3. After login Shopify redirects back to `/auth/callback?code=…&state=…`.
4. `/auth/callback` exchanges the code for an **access + refresh token** at
   the Customer Account OAuth token endpoint.
5. Tokens are saved in `localStorage`. The user is sent to `/account`
   (or whichever page they originally tried to open).
6. `/account` and `/orders` call the Customer Account GraphQL API directly
   using the stored access token. On `401`, the layer auto-refreshes using
   the refresh token.
7. Logout clears tokens locally and hits Shopify's `/logout` endpoint.

## 6. Files involved

- `src/lib/shopify/customer-account.ts` — OAuth + PKCE + GraphQL transport.
- `src/lib/shopify/customer-queries.ts` — Profile and Orders queries.
- `src/context/CustomerAuthContext.tsx` — React state for auth.
- `src/pages/Login.tsx` — Triggers the OAuth redirect.
- `src/pages/AuthCallback.tsx` — Handles the OAuth return.
- `src/pages/Account.tsx` — Profile + addresses overview.
- `src/pages/Orders.tsx` — Order history with line items + tracking.

## 7. Troubleshooting

- **Redirected to Shopify and back instantly** — the redirect URI in your
  Customer Account API client doesn't exactly match. The path must be
  `/auth/callback` and the origin must match the current URL.
- **`invalid_grant` on token exchange** — the PKCE verifier was lost (browser
  cleared `sessionStorage`). Trigger login again.
- **`401` on every Customer Account query** — the Client ID is for the
  Storefront API, not the Customer Account API. Generate a Customer Account
  client (Step 1) and use that UUID.
- **Empty orders** — the logged-in customer has no orders, or new customer
  accounts is disabled in store settings.