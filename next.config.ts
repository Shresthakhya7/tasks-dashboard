import type { NextConfig } from "next";

const nextConfig={};

module.exports = nextConfig;

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

