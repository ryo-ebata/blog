import type { NextConfig } from 'next';

/* 本番環境でのみconsole.log/infoを除去（error/warnは保持） */
const getRemoveConsoleOption = () => {
  if (process.env.NODE_ENV === 'production') {
    return { exclude: ['error', 'warn'] };
  }
  return false;
};

const nextConfig: NextConfig = {
  /* コンパイラオプション */
  compiler: {
    removeConsole: getRemoveConsoleOption(),
  },
  /* パフォーマンス最適化 */
  compress: true,
  /* 実験的な機能 */
  experimental: {
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },
};

export default nextConfig;
