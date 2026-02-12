import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  
  turbopack: {
    root: __dirname,
  },
  
  // eslint: {
  //   ignoreDuringBuilds: true, // 禁用构建时的 ESLint 检查
  // }
};

export default nextConfig;
