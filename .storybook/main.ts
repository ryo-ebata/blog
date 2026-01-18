import type { StorybookConfig } from '@storybook/nextjs-vite';

/*
 * チャンクサイズの閾値
 */
const CHUNK_SIZE_WARNING_LIMIT = 2500;

const shouldSuppressWarning = (message?: string): boolean => {
  if (!message) {
    return false;
  }
  /*
   * "use client" 関連の警告をフィルタリング
   */
  if (
    message.includes('use client') ||
    message.includes('Module level directives') ||
    message.includes("Can't resolve original location")
  ) {
    return true;
  }
  /*
   * チャンクサイズの警告を抑制（Storybookのテスト用エントリーポイントが大きいため）
   */
  if (message.includes('chunks are larger') || message.includes('Some chunks are larger')) {
    return true;
  }
  return false;
};

const getManualChunks = (id: string): string | undefined => {
  if (!id.includes('node_modules')) {
    return undefined;
  }

  if (id.includes('react') || id.includes('react-dom')) {
    return 'vendor-react';
  }
  if (id.includes('@storybook')) {
    if (id.includes('@storybook/core') || id.includes('@storybook/preview')) {
      return 'vendor-storybook-core';
    }
    if (id.includes('@storybook/addon')) {
      return 'vendor-storybook-addons';
    }
    return 'vendor-storybook';
  }
  if (id.includes('lucide-react') || id.includes('@tabler')) {
    return 'vendor-icons';
  }
  if (id.includes('next-themes')) {
    return 'vendor-themes';
  }
  return 'vendor';
};

const config: StorybookConfig = {
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  stories: ['../stories/**/*.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)', '!../node_modules/**'],
  viteFinal(viteConfig) {
    viteConfig.build = viteConfig.build || {};
    /*
     * Storybookのテスト用エントリーポイント（vite-inject-mocker-entry.js）が大きいため、閾値を上げる
     */
    viteConfig.build.chunkSizeWarningLimit = CHUNK_SIZE_WARNING_LIMIT;
    viteConfig.build.rollupOptions = viteConfig.build.rollupOptions || {};

    const originalOnwarn = viteConfig.build.rollupOptions.onwarn;
    viteConfig.build.rollupOptions.onwarn = (warning, warn) => {
      if (shouldSuppressWarning(warning.message)) {
        return;
      }
      if (originalOnwarn) {
        originalOnwarn(warning, warn);
      } else {
        warn(warning);
      }
    };

    viteConfig.build.rollupOptions.output = {
      ...viteConfig.build.rollupOptions.output,
      manualChunks: getManualChunks,
    };

    return viteConfig;
  },
};
export default config;
