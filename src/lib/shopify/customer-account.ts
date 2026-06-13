// Shopify Customer Account API – OAuth 2.0 (PKCE) helper layer.
// Docs: https://shopify.dev/docs/api/customer
import { SHOPIFY_CONFIG } from "./client";

const SHOP_ID = SHOPIFY_CONFIG.shopId;
// Customer Account API version (independent of Storefront API version).
const CUSTOMER_API_VERSION = "2024-10";

export const CUSTOMER_OAUTH = {
  authorize: `https://shopify.com/${SHOP_ID}/auth/oauth/authorize`,
  token: `https://shopify.com/${SHOP_ID}/auth/oauth/token`,
  logout: `https://shopify.com/${SHOP_ID}/auth/logout`,
  graphql: `https://shopify.com/${SHOP_ID}/account/customer/api/${CUSTOMER_API_VERSION}/graphql`,
  clientId: SHOPIFY_CONFIG.publicClientId,
  // Required scopes for Customer Account API:
  //  - openid + email: identity
  //  - https://api.customers.com/auth/customer.graphql: GraphQL access to /account/customer/api
  scope: "openid email https://api.customers.com/auth/customer.graphql",
};

/** 
 * Checks if the authentication requests are failing due to tracking protection or browser restrictions.
 */
export function diagnoseAuthEnvironment() {
  if (typeof window === 'undefined') return;
  
  const isBrave = (navigator as any).brave !== undefined;
  const hasContentBlocker = !document.getElementById('root'); // Simple heuristic

  if (isBrave) {
    console.warn("🛡️ Brave Browser detected. If login fails, try disabling 'Shields' for this site as it may block Shopify's auth scripts.");
  }
}

export const STORAGE = {
  accessToken: "nor_customer_access_token",
  refreshToken: "nor_customer_refresh_token",
  idToken: "nor_customer_id_token",
  expiresAt: "nor_customer_expires_at",
  verifier: "nor_pkce_verifier",
  state: "nor_oauth_state",
  redirectAfter: "nor_redirect_after_login",
};

function base64UrlEncode(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function randomString(len = 64) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr.buffer);
}

async function sha256(str: string) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(hash);
}

export function getRedirectUri() {
  // Always use the current origin so previews, staging, and production
  // all work as long as each origin is registered in the Shopify app.
  // For the apex production domain, normalise to www to match the
  // single registered redirect URI.
  if (window.location.hostname === "norperfume.com") {
    return "https://www.norperfume.com/auth/callback";
  }
  return `${window.location.origin}/auth/callback`;
}

/** Begin login: build PKCE pair, persist verifier + state, redirect to Shopify. */
export async function beginLogin(returnTo = window.location.pathname) {
  // Clear any existing partial/old session before starting new login
  // We use localStorage instead of sessionStorage for PKCE state to improve 
  // reliability on mobile browsers (like iPhone Google App) where 
  // sessionStorage might be cleared during redirects.
  localStorage.removeItem(STORAGE.verifier);
  localStorage.removeItem(STORAGE.state);
  localStorage.removeItem(STORAGE.redirectAfter);
  // Also clear session storage to be sure
  sessionStorage.removeItem(STORAGE.verifier);
  sessionStorage.removeItem(STORAGE.state);
  sessionStorage.removeItem(STORAGE.redirectAfter);

  // Add preconnect to Shopify auth domain immediately
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://shopify.com';
  document.head.appendChild(preconnect);

  // Fix domain mismatch before starting:
  // If user is on norperfume.com, redirect them to www.norperfume.com/login 
  // to ensure state is preserved when Shopify redirects back to 'www'.
  if (window.location.hostname === "norperfume.com") {
    window.location.href = `https://www.norperfume.com/login?returnTo=${encodeURIComponent(returnTo)}`;
    return;
  }

  if (!SHOP_ID) {
    console.error("❌ Auth Error: SHOP_ID is missing in configuration.");
    alert("System configuration error: Shop ID is missing. Please check your environment variables.");
    return;
  }

  // Check for crypto.subtle support (required for PKCE)
  if (!window.crypto || !window.crypto.subtle) {
    console.error("❌ Auth Error: window.crypto.subtle is not available.");
    alert("Your browser security settings or version do not support secure login. Please try using Safari or Chrome directly.");
    return;
  }

  const verifier = randomString(64);
  const state = randomString(16);
  const challenge = await sha256(verifier);

  localStorage.setItem(STORAGE.verifier, verifier);
  localStorage.setItem(STORAGE.state, state);
  localStorage.setItem(STORAGE.redirectAfter, returnTo);
  
  // Double-store in sessionStorage as a fallback for some older iOS browsers
  try {
    sessionStorage.setItem(STORAGE.verifier, verifier);
    sessionStorage.setItem(STORAGE.state, state);
    sessionStorage.setItem(STORAGE.redirectAfter, returnTo);
  } catch (e) {
    // Ignore if session storage is disabled
  }

  const params = new URLSearchParams({
    scope: CUSTOMER_OAUTH.scope,
    client_id: CUSTOMER_OAUTH.clientId,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  
  const authUrl = `${CUSTOMER_OAUTH.authorize}?${params.toString()}`;
  window.location.href = authUrl;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
}

/** Handle /auth/callback: exchange `code` for access + refresh tokens. */
export async function handleCallback(search: string) {
  const params = new URLSearchParams(search);
  const code = params.get("code");
  const state = params.get("state");
  
  // Try reading from localStorage first (new robust way)
  let expectedState = localStorage.getItem(STORAGE.state);
  let verifier = localStorage.getItem(STORAGE.verifier);
  
  // Fallback to sessionStorage for backward compatibility during transition
  if (!expectedState) expectedState = sessionStorage.getItem(STORAGE.state);
  if (!verifier) verifier = sessionStorage.getItem(STORAGE.verifier);

  if (!code) {
    console.error("❌ OAuth Callback Error: No code received from Shopify.");
    throw new Error("No authorization code received.");
  }

  if (!state || state !== expectedState) {
    console.error("❌ OAuth Callback Error: State mismatch.", { 
      received: state, 
      expected: expectedState,
      source: localStorage.getItem(STORAGE.state) ? 'localStorage' : 'sessionStorage'
    });
    // Clean up to allow retry
    localStorage.removeItem(STORAGE.state);
    localStorage.removeItem(STORAGE.verifier);
    sessionStorage.removeItem(STORAGE.state);
    sessionStorage.removeItem(STORAGE.verifier);
    throw new Error("Invalid OAuth session (state mismatch). This can happen if the browser session was reset or if cookies are restricted.");
  }

  if (!verifier) {
    console.error("❌ OAuth Callback Error: PKCE verifier missing.");
    throw new Error("Security verification failed (verifier missing).");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CUSTOMER_OAUTH.clientId,
    redirect_uri: getRedirectUri(),
    code,
    code_verifier: verifier,
  });

  const res = await fetch(CUSTOMER_OAUTH.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("❌ Token Exchange Failed:", {
      status: res.status,
      body: txt
    });
    // Clean up to allow retry
    localStorage.removeItem(STORAGE.state);
    localStorage.removeItem(STORAGE.verifier);
    throw new Error(`Token exchange failed (${res.status}). Please try logging in again.`);
  }

  const data = (await res.json()) as TokenResponse;
  persistTokens(data);

  const returnTo = localStorage.getItem(STORAGE.redirectAfter) || sessionStorage.getItem(STORAGE.redirectAfter) || "/account";
  
  // Clean up PKCE state
  localStorage.removeItem(STORAGE.verifier);
  localStorage.removeItem(STORAGE.state);
  localStorage.removeItem(STORAGE.redirectAfter);
  sessionStorage.removeItem(STORAGE.verifier);
  sessionStorage.removeItem(STORAGE.state);
  sessionStorage.removeItem(STORAGE.redirectAfter);
  
  return returnTo;
}

function persistTokens(data: TokenResponse) {
  const expiresAt = Date.now() + data.expires_in * 1000;
  localStorage.setItem(STORAGE.accessToken, data.access_token);
  localStorage.setItem(STORAGE.refreshToken, data.refresh_token);
  if (data.id_token) localStorage.setItem(STORAGE.idToken, data.id_token);
  localStorage.setItem(STORAGE.expiresAt, String(expiresAt));
}

function getLogoutRedirectUri() {
  // Use current origin, but normalize norperfume.com to www.norperfume.com
  // to match whitelisted redirect URIs in Shopify and ensure Vercel 
  // correctly handles the landing page.
  // We remove the trailing slash to stay consistent with vercel.json "trailingSlash": false
  if (window.location.hostname === "norperfume.com") {
    return "https://www.norperfume.com";
  }
  return window.location.origin;
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  // Clear all storage keys defined in STORAGE
  Object.values(STORAGE).forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
  // Clear any legacy keys just in case
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_refresh_token");
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE.accessToken);
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  const t = getAccessToken();
  const expStr = localStorage.getItem(STORAGE.expiresAt);
  if (!t || !expStr) return false;
  
  const exp = Number(expStr);
  const isValid = Date.now() < exp;
  
  return isValid;
}

/** Refresh the access token using the refresh token. Returns new access token or null. */
export async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem(STORAGE.refreshToken);
  if (!refresh) return null;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CUSTOMER_OAUTH.clientId,
    refresh_token: refresh,
  });
  const res = await fetch(CUSTOMER_OAUTH.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = (await res.json()) as TokenResponse;
  persistTokens(data);
  return data.access_token;
}

/** Logout: revokes session on Shopify and clears tokens. */
export function logout() {
  const idToken = localStorage.getItem(STORAGE.idToken);
  clearTokens();
  if (!idToken) {
    // Redirect to home with domain normalization
    if (window.location.hostname === "norperfume.com") {
      window.location.assign("https://www.norperfume.com");
    } else {
      window.location.assign("/");
    }
    return;
  }

  const params = new URLSearchParams({
    client_id: CUSTOMER_OAUTH.clientId,
    post_logout_redirect_uri: getLogoutRedirectUri(),
  });
  params.set("id_token_hint", idToken);
  window.location.href = `${CUSTOMER_OAUTH.logout}?${params.toString()}`;
}

interface GqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/** Customer Account API GraphQL query, with auto-refresh on 401. */
export async function customerQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const doFetch = (t: string) =>
    fetch(CUSTOMER_OAUTH.graphql, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: t,
      },
      body: JSON.stringify({ query, variables }),
    });

  let res = await doFetch(token);
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) throw new Error("Session expired");
    res = await doFetch(refreshed);
  }
  const payload = (await res.json()) as GqlResponse<T>;
  if (payload.errors?.length) throw new Error(payload.errors[0].message);
  return payload.data!;
}