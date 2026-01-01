import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // 允许局域网设备访问（用于手机测试）
  allowedDevOrigins: ['*'],
};

export default nextConfig;