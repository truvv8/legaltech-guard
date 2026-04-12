import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy to backend only in local dev
  ...(process.env.NODE_ENV === "development" && {
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8000/api/:path*",
        },
      ];
    },
  }),
};

export default nextConfig;
