import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Admin flows need request-time rendering (`instant = false` route config),
  // which requires cacheComponents in Next 16 (same setup as stitch-bd).
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
