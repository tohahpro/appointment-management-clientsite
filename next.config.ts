import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "res.cloudinary.com",
      }
    ]
  }
};

export default nextConfig;
