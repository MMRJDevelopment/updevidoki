import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all https hosts
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // matches http://localhost:5000/*
      },
    ],
  },
};

export default nextConfig;
