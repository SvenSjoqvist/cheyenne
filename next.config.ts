import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        pathname: "/api/v1/image/assets/**", // Allows all paths under `/api/v1/image/assets/`
      },
      {
        protocol: "https",
        hostname: "www.lspace.com",
        pathname: "/cdn/shop/files/**", // Allows all paths under `/cdn/shop/files/`
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**", // Correct pattern
      }
    ],
  },
};

export default nextConfig;