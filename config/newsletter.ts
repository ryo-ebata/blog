/**
 * ニュースレター購読の表示フラグ。
 * NEXT_PUBLIC_NEWSLETTER_ENABLED=true のときのみ購読UIを表示する(env 未設定で自動非表示)。
 * 実際の購読は app/api/newsletter/route.ts がサーバ専用 env BUTTONDOWN_API_KEY を使って
 * プロバイダ(buttondown 想定)へプロキシし、APIキーをクライアントに露出しない。
 */
export const isNewsletterEnabled = process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true';
