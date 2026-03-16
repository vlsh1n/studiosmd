import type { NextConfig } from "next";

// 'unsafe-inline' in script-src is required for:
//   - Next.js App Router inline hydration scripts
//   - GA4 init inline <Script id="ga4-init">
// To remove it, implement CSP nonces via middleware (Next.js docs: /docs/app/building-your-application/configuring/content-security-policy)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.ko-fi.com https://static.cloudflareinsights.com",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://www.googletagmanager.com https://*.ko-fi.com",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https://*.ko-fi.com https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-src https://ko-fi.com https://*.ko-fi.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
