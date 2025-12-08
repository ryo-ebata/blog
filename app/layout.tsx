import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import { Header } from '@/components/elements/header/header';
import { JsonLd } from '@/components/jsonld/jsonld';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/contexts/theme-provider';
import { generateOrganizationJsonLd } from '@/lib/jsonld';
import './globals.css';
import { Footer } from '@/components/elements/footer/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd();

  // ちらつきを防ぐためのインラインスクリプト
  // URLクエリパラメータからテーマを読み取り、html要素にクラスを追加
  // デフォルトはダークモード
  // 参考: https://blog.stin.ink/articles/how-to-implement-a-perfect-dark-mode
  const themeScript = `
    (function() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const themeFromUrl = urlParams.get('theme');
        const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        let colorMode;
        if (themeFromUrl === 'light') {
          colorMode = 'light';
        } else if (themeFromUrl === 'system') {
          colorMode = prefers;
        } else {
          // テーマが指定されていない場合はダークモードをデフォルトとする
          colorMode = 'dark';
        }
        if (colorMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // エラーが発生した場合はダークモードをデフォルトとする
        document.documentElement.classList.add('dark');
      }
    })();
  `
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <html lang="ja" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono`}>
        <JsonLd data={organizationJsonLd} />
        <NuqsAdapter>
          <Suspense fallback={null}>
            <ThemeProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </ThemeProvider>
          </Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
