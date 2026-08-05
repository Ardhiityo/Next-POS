import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fneinfnzsatdwmzamqji.supabase.co",
      },
    ],
  },
  output: "standalone"
};

export default nextConfig;
