import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // قم بإزالة domains تماماً
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alfareed.admin.t-carts.com',
        port: '',
        pathname: '/storage/**',
      },
       {
        protocol: 'http', // في حالة استخدام http للتطوير المحلي
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;