'use client';

import { useEffect, useRef } from 'react';

import { giscusConfig, isGiscusEnabled } from '@/config/giscus';
import { useTheme } from '@/contexts/theme-provider';

const GISCUS_ORIGIN = 'https://giscus.app';

const toGiscusTheme = (theme?: string): string => (theme === 'dark' ? 'dark' : 'light');

/**
 * giscus コメント欄。env 未設定時は描画しない。
 * テーマ切替に追従(マウント後は postMessage で giscus 側へ反映)。
 */
export const GiscusComments = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  /* マウント時に giscus スクリプトを一度だけ注入する */
  useEffect(() => {
    const container = containerRef.current;
    if (!isGiscusEnabled || !container || container.hasChildNodes()) {
      return;
    }
    const script = document.createElement('script');
    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    const attributes: Record<string, string> = {
      'data-repo': giscusConfig.repo,
      'data-repo-id': giscusConfig.repoId,
      'data-category': giscusConfig.category,
      'data-category-id': giscusConfig.categoryId,
      'data-mapping': 'pathname',
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': toGiscusTheme(theme),
      'data-lang': 'ja',
    };
    for (const [key, value] of Object.entries(attributes)) {
      script.setAttribute(key, value);
    }
    container.appendChild(script);
    // theme はマウント後の effect で同期するため依存に含めない
    // biome-ignore lint/correctness/useExhaustiveDependencies: マウント時一度だけ注入
  }, []);

  /* テーマ変更を giscus iframe に反映する */
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: toGiscusTheme(theme) } } },
      GISCUS_ORIGIN
    );
  }, [theme]);

  if (!isGiscusEnabled) {
    return null;
  }

  return (
    <section aria-label="コメント" className="mt-10">
      <div ref={containerRef} />
    </section>
  );
};
