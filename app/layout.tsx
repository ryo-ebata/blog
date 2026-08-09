import './globals.css';
import { Footer, Header } from '@/components/organisms';
import { GoogleTagManager } from '@next/third-parties/google';
import { Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import { JsonLd } from '@/components/jsonld/jsonld';
import { adsConfig } from '@/config/ads';
import { analyticsConfig, isGtmEnabled } from '@/config/analytics';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ViewTransitions } from 'next-view-transitions';
import { type ReactNode, Suspense } from 'react';
import { ThemeProvider } from '@/contexts/theme-provider';
import { generateOrganizationJsonLd } from '@/lib/jsonld';
import { siteConfig } from '@/config/site';
import { WebVitals } from './_components/web-vitals';

// oxlint-disable-next-line new-cap -- Noto_Sans_JP is exported from next/font/google
const notoSansJP = Noto_Sans_JP({
  adjustFontFallback: true,
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/rss.xml`,
      'application/feed+json': `${siteConfig.url}/feed.json`,
    },
  },
  description: siteConfig.description,
  openGraph: {
    description: siteConfig.description,
    locale: 'ja_JP',
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: 'website',
    url: siteConfig.url,
  },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  twitter: {
    card: 'summary_large_image',
    description: siteConfig.description,
    title: siteConfig.name,
  },
  ...(siteConfig.verification.google && {
    verification: { google: siteConfig.verification.google },
  }),
};

/**
 * ちらつきを防ぐためのテーマ初期化スクリプトを生成する
 * URLクエリパラメータからテーマを読み取り、html要素にクラスを追加
 * デフォルトはダークモード
 * 参考: https://blog.stin.ink/articles/how-to-implement-a-perfect-dark-mode
 */
const createThemeScript = (): string =>
  `
    (function() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const themeFromUrl = urlParams.get('theme');
        const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        let colorMode = 'light';
        if (themeFromUrl === 'dark') {
          colorMode = 'dark';
        } else if (themeFromUrl === 'system') {
          colorMode = prefers;
        }
        if (colorMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        document.documentElement.classList.remove('dark');
      }
    })();
  `
    .replace(/\s+/g, ' ')
    .trim();

const PageLayout = ({ children }: { children: ReactNode }) => (
  <>
    <WebVitals />
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow focus:outline-none focus:ring-2 focus:ring-ring"
    >
      本文へスキップ
    </a>
    <Header />
    <main id="main" tabIndex={-1}>
      {children}
    </main>
    <Footer />
  </>
);

const ThemeWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <PageLayout>{children}</PageLayout>
  </ThemeProvider>
);

const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={null}>
    <ThemeWrapper>{children}</ThemeWrapper>
  </Suspense>
);

const AppProviders = ({ children }: { children: ReactNode }) => (
  <NuqsAdapter>
    <SuspenseWrapper>{children}</SuspenseWrapper>
  </NuqsAdapter>
);

const BodyContent = ({ children }: { children: ReactNode }) => {
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <AppProviders>{children}</AppProviders>
    </>
  );
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const themeScript = createThemeScript();

  return (
    <ViewTransitions>
      <html lang="ja" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: themeScript,
            }}
          />
          {adsConfig.adsense.clientId && (
            <Script
              id="google-adsense"
              async
              strategy="afterInteractive"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.adsense.clientId}`}
              crossOrigin="anonymous"
            />
          )}
        </head>
        <body className={`${notoSansJP.variable} antialiased font-sans`}>
          {isGtmEnabled && <GoogleTagManager gtmId={analyticsConfig.gtm.containerId} />}
          <BodyContent>{children}</BodyContent>
        </body>
      </html>
    </ViewTransitions>
  );
};

export default RootLayout;
