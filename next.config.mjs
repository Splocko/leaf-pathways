/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    // Apply strict security headers in production only. In dev we return none so
    // Next tooling (HMR, eval'd chunks) isn't disrupted.
    if (process.env.NODE_ENV !== "production") return [];

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "no-referrer-when-downgrade" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Permissions-Policy",
        value: "geolocation=(), microphone=(), camera=(), payment=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://cueuwyazwjikiogxsbrs.supabase.co https://leafpathways.com https://images.unsplash.com https://i.pravatar.cc",
          "media-src 'self' blob: https://leafpathways.com",
          "font-src 'self' data:",
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      },
    ];

    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
