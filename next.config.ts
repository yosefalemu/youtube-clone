import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chl13wkv0t.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
