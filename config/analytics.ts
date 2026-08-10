/**
 * アクセス解析（GTM）設定ハブ。
 *
 * GA4 は GTM コンテナ内で設定タグとして発火させる方針のため、
 * ここでは GTM コンテナ ID のみを扱う。gtag 直書きとの併用は二重計測になるため禁止。
 * IDが未設定（空文字）の間は GTM 自体を読み込まない。
 */

export const analyticsConfig = {
  gtm: {
    /** GTM コンテナID (GTM-XXXXXXX)。未設定なら GTM を読み込まない。 */
    containerId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
  },
} as const;

/** GTMが有効か(コンテナIDが設定済みか) */
export const isGtmEnabled = analyticsConfig.gtm.containerId !== '';
