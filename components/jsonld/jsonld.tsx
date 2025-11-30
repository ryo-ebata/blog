'use client';

import DOMPurify from 'isomorphic-dompurify';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JSON-LDを安全にレンダリングするコンポーネント
 * DOMPurifyを使用してXSS攻撃を防ぐ
 *
 * @see https://qiita.com/ushi_osushi/items/2c09e2d3a1f3db63e5a3
 */
export function JsonLd({ data }: JsonLdProps) {
  // JSON-LDを文字列化
  const jsonLdString = JSON.stringify(data, null, 0);

  // DOMPurifyでサニタイズ
  // JSON-LDはJSON形式なので基本的に安全だが、念のためサニタイズ
  // KEEP_CONTENT: true により、JSONの内容を保持
  const sanitizedJsonLd = DOMPurify.sanitize(jsonLdString, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    // JSON-LDの内容を保持するための設定
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  });

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LDはDOMPurifyでサニタイズ済みのため安全
      dangerouslySetInnerHTML={{ __html: sanitizedJsonLd }}
    />
  );
}
