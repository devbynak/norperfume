const DEFAULT_SHOPIFY_CONFIG = {
  domain: "nor-perfume-4.myshopify.com",
  apiVersion: "2024-10",
  accessToken: "fc29a36d6125e84571622102bbf55564",
  publicClientId: "31bf33fe-e658-4481-a8ff-3f48984f836d",
  shopId: "81366548706",
};

// Helper to get environment variables safely across Browser (Vite) and Node (Vercel)
const getEnv = (key: string): string => {
  const meta = (import.meta as any);
  
  // Static access for common keys to ensure Vite replaces them at build time
  if (key === 'VITE_SHOPIFY_DOMAIN') return import.meta.env.VITE_SHOPIFY_DOMAIN || "";
  if (key === 'VITE_SHOPIFY_API_VERSION') return import.meta.env.VITE_SHOPIFY_API_VERSION || "";
  if (key === 'VITE_SHOPIFY_ACCESS_TOKEN') return import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || "";
  if (key === 'VITE_SHOPIFY_PUBLIC_CLIENT_ID') return import.meta.env.VITE_SHOPIFY_PUBLIC_CLIENT_ID || "";
  if (key === 'VITE_SHOPIFY_SHOP_ID') return import.meta.env.VITE_SHOPIFY_SHOP_ID || "";

  if (typeof meta !== 'undefined' && meta.env && meta.env[key]) {
    return meta.env[key];
  }
  
  try {
    // @ts-expect-error process may be unavailable in browser
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      // @ts-expect-error process may be unavailable in browser
      return process.env[key];
    }
  } catch (e) {
    // Fallback for environments where process might be restricted
  }
  
  return "";
};

export const SHOPIFY_CONFIG = {
  domain: getEnv('VITE_SHOPIFY_DOMAIN') || DEFAULT_SHOPIFY_CONFIG.domain,
  apiVersion: getEnv('VITE_SHOPIFY_API_VERSION') || DEFAULT_SHOPIFY_CONFIG.apiVersion,
  accessToken: getEnv('VITE_SHOPIFY_ACCESS_TOKEN') || DEFAULT_SHOPIFY_CONFIG.accessToken,
  publicClientId: getEnv('VITE_SHOPIFY_PUBLIC_CLIENT_ID') || DEFAULT_SHOPIFY_CONFIG.publicClientId,
  shopId: getEnv('VITE_SHOPIFY_SHOP_ID') || DEFAULT_SHOPIFY_CONFIG.shopId,
};

// Runtime validation for production connection
if (typeof window !== 'undefined' && !SHOPIFY_CONFIG.domain) {
  console.error(
    "⚠️ Shopify Domain is missing. If you are in production, please add VITE_SHOPIFY_DOMAIN to your Vercel Environment Variables and redeploy."
  );
}

export const SHOPIFY_STORE_URL = `https://${SHOPIFY_CONFIG.domain}`;
export const SHOPIFY_ENDPOINT = `${SHOPIFY_STORE_URL}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
// New Customer Accounts are hosted on shopify.com/SHOP_ID/account
export const SHOPIFY_ACCOUNT_URL = `https://shopify.com/${SHOPIFY_CONFIG.shopId}/account`;
export const SHOPIFY_ORDERS_URL = `${SHOPIFY_ACCOUNT_URL}/orders`;
export const SHOPIFY_LOGIN_URL = `https://shopify.com/${SHOPIFY_CONFIG.shopId}/auth/login`;


interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

// Retry config for transient Shopify Storefront errors (network blips, 429, 5xx)
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 400; // 400ms, 800ms, 1600ms (+ jitter)
const REQUEST_TIMEOUT_MS = 12_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isRetriableStatus = (s: number) => s === 408 || s === 425 || s === 429 || (s >= 500 && s < 600);

async function fetchWithTimeout(input: RequestInfo, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function shopifyQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(
        SHOPIFY_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.accessToken,
          },
          body: JSON.stringify({ query, variables }),
          // Ensure we don't send Cache-Control which can trigger CORS preflight issues
          cache: "no-store",
        },
        REQUEST_TIMEOUT_MS,
      );

      if (!response.ok) {
        if (isRetriableStatus(response.status) && attempt < MAX_RETRIES) {
          const retryAfter = Number(response.headers.get("retry-after")) * 1000;
          const backoff = Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter
            : BASE_DELAY_MS * 2 ** attempt + Math.random() * 200;
          await sleep(backoff);
          continue;
        }
        throw new Error(`Shopify API Error: ${response.status}`);
      }

      const payload = (await response.json()) as ShopifyGraphQLResponse<T>;
      if (payload.errors) throw new Error(payload.errors[0].message);
      return payload.data!;
    } catch (err) {
      lastError = err;
      // Retry on network/abort errors; bail on GraphQL errors (no response.ok path)
      const isAbort = err instanceof DOMException && err.name === "AbortError";
      const isNetwork = err instanceof TypeError; // fetch network failure
      if (attempt < MAX_RETRIES && (isAbort || isNetwork)) {
        await sleep(BASE_DELAY_MS * 2 ** attempt + Math.random() * 200);
        continue;
      }
      throw err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Shopify request failed");
}

/**
 * 🔐 SHOPIFY CUSTOMER ACCOUNT API QUERY
 */
export async function shopifyCustomerQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  accessToken: string,
) {
  // Use the standard high-performance endpoint
  const url = `https://shopify.com/${SHOPIFY_CONFIG.shopId}/account/customer/api/${SHOPIFY_CONFIG.apiVersion}/graphql`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("customer_token");
      window.location.replace("/login");
    }
    throw new Error(`Shopify API Error: ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyGraphQLResponse<T>;
  if (payload.errors) throw new Error(payload.errors[0].message);
  return payload.data!;
}
