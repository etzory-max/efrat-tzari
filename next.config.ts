import type { NextConfig } from "next";

/**
 * What the browser is allowed to load, and from where. Without it, anything
 * that manages to get a tag onto the page can pull a script from anywhere;
 * with it, the page only trusts itself and the two services it actually uses.
 */
const SITE_CSP = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com; font-src 'self' data:; connect-src 'self' https://*.api.sanity.io https://cdn.sanity.io; frame-src https://www.youtube-nocookie.com; media-src 'self'; upgrade-insecure-requests";

const STUDIO_CSP = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://core.sanity-cdn.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://design-system-static.sanity.io; font-src 'self' data: https://design-system-static.sanity.io; img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com; connect-src 'self' https://*.api.sanity.io wss://*.api.sanity.io https://*.sanity.io https://cdn.sanity.io https://core.sanity-cdn.com blob: data:; frame-src 'self' https://*.sanity.io; form-action 'self' https://*.sanity.io";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  /* The press piece about the book links to tzory.com/book - the path the
     old WordPress site used - and that has been a 404 since the rebuild.
     The page it was pointing at now exists under its own name. */
  async redirects() {
    return [{ source: "/book", destination: "/gentle-cracks", permanent: true }];
  },
  async headers() {
    return [
      /* The Studio first: the matcher for the site below would otherwise
         hand it a policy it cannot run under. */
      {
        source: "/studio",
        headers: [{ key: "Content-Security-Policy", value: STUDIO_CSP }],
      },
      {
        source: "/studio/:path*",
        headers: [{ key: "Content-Security-Policy", value: STUDIO_CSP }],
      },
      {
        /* Everything except the Studio. A plain "/:path*" would match the
           Studio too, and the later rule wins - which is how the Studio got
           handed a policy it cannot run under on the first attempt. */
        source: "/:path((?!studio).*)",
        headers: [
          { key: "Content-Security-Policy", value: SITE_CSP },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
