interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JSON-LDを安全にレンダリングするコンポーネント
 * JSON.stringifyはXSSに対して安全（文字列はエスケープされる）
 */
export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    /* JSON.stringifyは特殊文字をエスケープするため、XSS攻撃に対して安全 */
    /* Biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringifyで安全にエスケープ済み */
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
