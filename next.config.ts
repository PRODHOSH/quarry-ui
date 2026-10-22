import type { NextConfig } from "next";

// Static assets are cached hard at the edge and in the browser. They only change when the site is
// redeployed, and stale-while-revalidate keeps a new version from ever blocking a visit.
const longCache = [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return ["/thumbs/:path*", "/r/:path*", "/design-md/:path*", "/doodles/:path*", "/brand/:path*"].map((source) => ({ source, headers: longCache }));
  },
};

export default nextConfig;
