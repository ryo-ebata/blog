import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents: true,
  // パフォーマンス最適化
  compress: true,
  // 実験的な機能
  experimental: {
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },
  // コンパイラオプション
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
