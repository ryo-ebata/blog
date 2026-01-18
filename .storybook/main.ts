import type { StorybookConfig } from '@storybook/nextjs-vite';

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
  async viteFinal(config) {
    // チャンクサイズの警告を改善するための設定
    config.build = config.build || {};
    // Storybookのテスト用エントリーポイント（vite-inject-mocker-entry.js）が大きいため、閾値を上げる
    config.build.chunkSizeWarningLimit = 2500; // 2.5MBに引き上げ
    config.build.rollupOptions = config.build.rollupOptions || {};

    // "use client" ディレクティブとチャンクサイズの警告を抑制
    const originalOnwarn = config.build.rollupOptions.onwarn;
    config.build.rollupOptions.onwarn = (warning, warn) => {
      // "use client" 関連の警告をフィルタリング
      if (
        warning.message?.includes('use client') ||
        warning.message?.includes('Module level directives') ||
        warning.message?.includes("Can't resolve original location")
      ) {
        return; // 警告を抑制
      }
      // チャンクサイズの警告を抑制（Storybookのテスト用エントリーポイントが大きいため）
      if (
        warning.message?.includes('chunks are larger') ||
        warning.message?.includes('Some chunks are larger')
      ) {
        return; // 警告を抑制
      }
      // その他の警告は通常通り処理
      if (originalOnwarn) {
        originalOnwarn(warning, warn);
      } else {
        warn(warning);
      }
    };

    config.build.rollupOptions.output = {
      ...config.build.rollupOptions.output,
      manualChunks: (id) => {
        // node_modulesを別チャンクに分離
        if (id.includes('node_modules')) {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('@storybook')) {
            // Storybookのチャンクをさらに分割
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
        }
      },
    };

    return config;
  },
};
export default config;
