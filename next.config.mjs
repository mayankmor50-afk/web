/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production';

// script-src: dev needs 'unsafe-eval' for Next's HMR bundler and allows the
// dev-only Figma capture script; production drops both.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  'https://va.vercel-scripts.com',
  ...(isDev ? ["'unsafe-eval'", 'https://mcp.figma.com'] : []),
].join(' ');

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src ${scriptSrc}`,
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  // Only force-upgrade subresources to HTTPS in production (would break http://localhost in dev).
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 92],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
}

export default nextConfig
