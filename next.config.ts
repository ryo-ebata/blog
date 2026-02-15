import type { NextConfig } from 'next';

/* 本番環境でのみconsole.log/infoを除去（error/warnは保持） */
const getRemoveConsoleOption = () => {
  if (process.env.NODE_ENV === 'production') {
    return { exclude: ['error', 'warn'] };
  }
  return false;
};

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdnjs.buymeacoffee.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
];

const nextConfig: NextConfig = {
  /* コンパイラオプション */
  compiler: {
    removeConsole: getRemoveConsoleOption(),
  },
  /* パフォーマンス最適化 */
  compress: true,
  /* 画像最適化設定 */
  images: {
    remotePatterns: [
      {
        hostname: 'images.microcms-assets.io',
        protocol: 'https',
      },
    ],
  },
  /* X-Powered-By ヘッダーを無効化 */
  poweredByHeader: false,
  /* 実験的な機能 */
  experimental: {
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },
  /* セキュリティヘッダー */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
