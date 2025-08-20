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
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // 禁用构建时的 ESLint 检查
  },
  async headers() {
    return [
      {
        // 匹配所有路径，也可以根据需求指定特定路径，如 /api/* 只匹配 /api 开头的路径
        source: '/:path*', 
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            // 将其替换为你实际的前端域名
            value: 'https://linkzap.link' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ];
  }
};

export default nextConfig;
