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
  // Scope: Only request 'openid email' to avoid "invalid scope" errors.
  // API access is usually granted automatically to the client ID in Shopify Admin.
  scope: "openid email",
};

/** 
 * Checks if the authentication requests are failing due to tracking protection or browser restrictions.
 */
export function diagnoseAuthEnvironment() {
  if (typeof window === 'undefined') return;
  
  const isBrave = (navigator as any).brave !== undefined;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const hasContentBlocker = !document.getElementById('root'); // Simple heuristic

  if (isBrave) {
    console.warn("🛡️ Brave Browser detected. If login fails, try disabling 'Shields' for this site as it may block Shopify's auth scripts.");
  }

  if (isSafari) {
    console.warn("🛡️ Safari detected. If login fails, ensure 'Prevent Cross-Site Tracking' is disabled or try a different browser.");
  }
}

export const STORAGE = {
  accessToken: "voom_customer_access_token",
  refreshToken: "voom_customer_refresh_token",
  idToken: "voom_customer_id_token",
  expiresAt: "voom_customer_expires_at",
  verifier: "voom_pkce_verifier",
  state: "voom_oauth_state",
  redirectAfter: "voom_redirect_after_login",
  loginLock: "voom_login_lock",
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
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    // Fallback for extremely rare cases where crypto is unavailable
    for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return base64UrlEncode(arr.buffer);
}

async function sha256(str: string) {
  const data = new TextEncoder().encode(str);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hash = await crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(hash);
  }
  throw new Error("Crypto Subtle API not available (required for PKCE)");
}

export function getRedirectUri() {
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  
  // Local development: Always prefer 'localhost' over '127.0.0.1' for origin consistency
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const port = window.location.port ? `:${window.location.port}` : "";
    return `http://localhost${port}/auth/callback`;
  }
  
  // Production or Staging
  // We prioritize the current origin if it's already 'www.norperfume.com'
  // Otherwise, we return the hardcoded whitelisted callback to ensure Shopify accepts it.
  if (hostname === "www.norperfume.com" || hostname === "norperfume.com") {
    return `${origin}/auth/callback`;
  }

  // Fallback for Vercel Previews / Other domains
  // Note: These MUST be added to Shopify Partners Whitelist or they will fail.
  return "https://www.norperfume.com/auth/callback";
}

/** Begin login: build PKCE pair, persist verifier + state, redirect to Shopify. */
export async function beginLogin(returnTo = window.location.pathname) {
  const hostname = window.location.hostname;
  const url = new URL(window.location.href);

  // 1. Origin Normalization: Force 127.0.0.1 -> localhost
  if (hostname === "127.0.0.1") {
    url.hostname = "localhost";
    window.location.href = url.toString();
    return;
  }

  // 2. Domain Normalization: Force naked domain -> www in production
  if (hostname === "norperfume.com") {
    console.log("🔄 Normalizing domain to www.norperfume.com...");
    url.hostname = "www.norperfume.com";
    window.location.href = url.toString();
    return;
  }

  if (!SHOP_ID) {
    console.error("❌ Auth Error: SHOP_ID is missing.");
    return;
  }

  const lockRaw = sessionStorage.getItem(STORAGE.loginLock);
  const lockTs = lockRaw ? Number(lockRaw) : 0;
  const lockValid = Number.isFinite(lockTs) && Date.now() - lockTs < 15_000;

  const existingVerifier = sessionStorage.getItem(STORAGE.verifier);
  const existingState = sessionStorage.getItem(STORAGE.state);

  const verifier = lockValid && existingVerifier ? existingVerifier : randomString(64);
  const state = lockValid && existingState ? existingState : randomString(16);
  const challenge = await sha256(verifier);

  sessionStorage.setItem(STORAGE.verifier, verifier);
  sessionStorage.setItem(STORAGE.state, state);
  sessionStorage.setItem(STORAGE.redirectAfter, returnTo);
  sessionStorage.setItem(STORAGE.loginLock, String(Date.now()));

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
  console.log("🚀 Initiating Shopify Login:", { 
    redirect_uri: getRedirectUri(),
    state,
    returnTo 
  });
  
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
  const expectedState = sessionStorage.getItem(STORAGE.state);
  const verifier = sessionStorage.getItem(STORAGE.verifier);

  if (!code) {
    console.error("❌ OAuth Callback Error: No code received from Shopify.");
    throw new Error("No authorization code received.");
  }

  if (!state || state !== expectedState) {
    console.error("❌ OAuth Callback Error: State mismatch.", { received: state, expected: expectedState });
    throw new Error("Invalid OAuth session (state mismatch).");
  }

  if (!verifier) {
    console.error("❌ OAuth Callback Error: PKCE verifier missing from sessionStorage.");
    throw new Error("Security verification failed (verifier missing).");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CUSTOMER_OAUTH.clientId,
    redirect_uri: getRedirectUri(),
    code,
    code_verifier: verifier,
  });

  console.log("🎟️ Exchanging code for token...", {
    tokenUrl: CUSTOMER_OAUTH.token,
    redirect_uri: getRedirectUri(),
    codeLength: code.length
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
      body: txt,
    });
    
    // Clear storage on failure to prevent stale state issues
    sessionStorage.removeItem(STORAGE.verifier);
    sessionStorage.removeItem(STORAGE.state);
    sessionStorage.removeItem(STORAGE.redirectAfter);
    sessionStorage.removeItem(STORAGE.loginLock);
    
    throw new Error(`Token exchange failed (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as TokenResponse;
  console.log("✅ Token Exchange Successful");
  persistTokens(data);

  const savedReturnTo = sessionStorage.getItem(STORAGE.redirectAfter);
  let returnTo = "/account";
  
  if (savedReturnTo) {
    try {
      // If it's a full URL, extract just the pathname + search
      if (savedReturnTo.startsWith("http")) {
        const url = new URL(savedReturnTo);
        // Only allow redirection to the same origin for security
        if (url.origin === window.location.origin) {
          returnTo = url.pathname + url.search;
        } else {
          console.warn("🛡️ Sanitizing external redirect URL:", savedReturnTo);
        }
      } else if (savedReturnTo.startsWith("/")) {
        returnTo = savedReturnTo;
      }
    } catch (e) {
      console.error("❌ Failed to parse returnTo URL:", e);
    }
  }

  sessionStorage.removeItem(STORAGE.verifier);
  sessionStorage.removeItem(STORAGE.state);
  sessionStorage.removeItem(STORAGE.redirectAfter);
  sessionStorage.removeItem(STORAGE.loginLock);
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
  return `${window.location.origin}/`;
}

export function clearTokens() {
  Object.values(STORAGE).forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
}

/** 
 * Validates state from URL against session storage.
 * In production, we force a check against the primary domain's state.
 */
export function validateOAuthState(receivedState: string | null) {
  const expectedState = sessionStorage.getItem(STORAGE.state);
  
  if (!receivedState || receivedState !== expectedState) {
    console.error("❌ OAuth State Mismatch:", { 
      received: receivedState, 
      expected: expectedState,
      domain: window.location.hostname
    });
    return false;
  }
  return true;
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE.accessToken);
}

export function isAuthenticated() {
  const t = getAccessToken();
  const expStr = localStorage.getItem(STORAGE.expiresAt);
  if (!t || !expStr) return false;
  
  const exp = Number(expStr);
  const isValid = Date.now() < exp;
  
  // If token is expired but we have a refresh token, we technically still have a session
  // that can be revived. However, for UI state, we treat it as unauthenticated until refreshed.
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
    window.location.assign("/");
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
