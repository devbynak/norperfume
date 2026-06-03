import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 8082,
      strictPort: false,
      hmr: {
        overlay: false,
      },
    },
    build: {
      target: 'esnext',
      reportCompressedSize: false, // Speed up build
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-framer';
              }
              if (id.includes('lucide-react') || id.includes('sonner') || id.includes('clsx')) {
                return 'vendor-ui';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    plugins: [
      react(),
      VitePWA({
        disable: mode === 'development',
        registerType: 'autoUpdate',
        manifest: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 // Increase limit to 10MB to handle large assets
        }
      }),
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            /%VITE_META_PIXEL_ID%/g,
            env.VITE_META_PIXEL_ID || "1006383931833299"
          ).replace(
            /%VITE_ENABLE_META_PIXEL%/g,
            env.VITE_ENABLE_META_PIXEL || "false"
          );
        },
      },
      {
        name: "api-newsletter",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === "/api/newsletter" && req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });

              req.on("end", async () => {
                try {
                  const { email } = JSON.parse(body);
                  const SHOP = env.SHOP || "nor-perfume-4.myshopify.com";
                  const ACCESS_TOKEN = env.ADMIN_API_TOKEN || process.env.ADMIN_API_TOKEN || "";

                  if (!ACCESS_TOKEN || !SHOP) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ success: true, message: "Subscribed successfully (graceful fallback)" }));
                    return;
                  }

                  const shopifyResponse = await fetch(`https://${SHOP}/admin/api/2024-01/customers.json`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Shopify-Access-Token": ACCESS_TOKEN,
                    },
                    body: JSON.stringify({
                      customer: {
                        email: email,
                        accepts_marketing: true,
                        marketing_opt_in_level: "single_opt_in",
                        email_marketing_consent: {
                          state: "subscribed",
                          opt_in_level: "single_opt_in",
                        },
                        tags: "newsletter",
                      },
                    }),
                  });

                  const data = (await shopifyResponse.json()) as { errors?: { email?: string[] } };
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");

                  if (shopifyResponse.ok) {
                    res.end(JSON.stringify({ success: true }));
                  } else {
                    if (data.errors && data.errors.email) {
                      const isDuplicate = data.errors.email.some((err: string) =>
                        err.includes("already been taken") || err.includes("exists") || err.includes("already")
                      );
                      if (isDuplicate) {
                        res.end(JSON.stringify({ success: true, message: "Already subscribed" }));
                        return;
                      }
                    }
                    res.end(JSON.stringify({ success: true, message: "Subscribed successfully (graceful fallback)" }));
                  }
                } catch (error) {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ success: true, message: "Subscribed successfully (graceful fallback)" }));
                }
              });
              return;
            }

            if (req.url && req.url.startsWith("/api/track")) {
              res.setHeader("Content-Type", "application/json");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

              if (req.method === "OPTIONS") {
                res.statusCode = 204;
                res.end();
                return;
              }

              const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
              const awb = urlObj.searchParams.get("awb") || "";

              const email = process.env.SHIPROCKET_EMAIL || env.SHIPROCKET_EMAIL;
              const password = process.env.SHIPROCKET_PASSWORD || env.SHIPROCKET_PASSWORD;

              if (!email || !password) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: "Shiprocket credentials are not configured. Please set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in your environment."
                }));
                return;
              }

              try {
                const authResponse = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password }),
                });

                if (!authResponse.ok) {
                  let errMsg = "Authentication with shipping partner failed.";
                  try {
                    const errData = await authResponse.json() as any;
                    if (errData.message) {
                      errMsg = `Authentication failed: ${errData.message}`;
                    } else if (errData.errors) {
                      errMsg = `Authentication failed: ${JSON.stringify(errData.errors)}`;
                    }
                  } catch (e) {
                    try {
                      const errText = await authResponse.text();
                      if (errText) errMsg = `Authentication failed: ${errText}`;
                    } catch (e2) {
                      // Ignore secondary error if text body reading fails
                    }
                  }
                  
                  errMsg += " (Tip: You must use a dedicated API User credentials created from Shiprocket Panel -> Settings -> API -> Add New API User, not your primary account credentials.)";

                  res.statusCode = 401;
                  res.end(JSON.stringify({ error: errMsg }));
                  return;
                }

                const authData = await authResponse.json() as { token: string };
                const token = authData.token;

                const trackingResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  }
                });

                if (!trackingResponse.ok) {
                  res.statusCode = trackingResponse.status;
                  res.end(JSON.stringify({ error: "Failed to fetch tracking details from carrier." }));
                  return;
                }

                const rawData = await trackingResponse.json() as any;
                const trackingData = rawData?.tracking_data;
                if (!trackingData || trackingData.track_status === 0) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: "Order / AWB number not found. Please verify the AWB number." }));
                  return;
                }

                const shipment = trackingData.shipment_track_activities || [];
                const latestActivity = trackingData.shipment_track?.[0] || {};
                const currentStatus = latestActivity.current_status || "In Processing";
                const estimatedDelivery = latestActivity.edd || "Pending";

                const mappedSteps = shipment.map((activity: any) => ({
                  status: activity.activity,
                  date: new Date(activity.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
                  desc: activity.location || "Carrier Hub",
                  completed: true,
                  current: false,
                }));

                if (mappedSteps.length === 0) {
                  mappedSteps.push({
                    status: currentStatus,
                    date: "Today",
                    desc: "Shipment details received by carrier.",
                    completed: true,
                    current: true
                  });
                } else {
                  mappedSteps[0].current = true;
                }

                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  status: currentStatus,
                  edd: estimatedDelivery,
                  steps: mappedSteps.reverse(),
                  rawData: rawData // Include original tracking details
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message || "Failed to retrieve tracking details." }));
              }
              return;
            }

            // Local Mock Reviews API
            if (req.url && req.url.startsWith("/api/reviews")) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                reviews: [],
                stats: { averageRating: 0, totalReviews: 0 },
                pagination: { page: 1, pages: 1 }
              }));
              return;
            }

            // Local Mock Eligibility API
            if (req.url && req.url.startsWith("/api/review/eligibility")) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                eligible: false,
                hasReviewed: false,
                resolvedId: null
              }));
              return;
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
