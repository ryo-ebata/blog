export const siteConfig = {
  description: '技術的な学びや日々の気づきを共有しています',
  author: {
    name: 'ebaryo.dev',
    bio: 'Software Engineer。Generative AI / Rust に関心。フロントエンド・データエンジニアリングの実務と日々の学びを発信しています。',
    /** プロフィール画像パス(任意)。未設定時はイニシャルを表示。 */
    avatar: '',
  },
  links: {
    github: 'https://github.com/ryo-ebata',
    qiita: 'https://qiita.com/ryo0403',
    twitter: 'https://x.com/ebaryo43',
    zenn: 'https://zenn.dev/ebarinyo',
  },
  name: 'ebaryo.dev',
  repo: 'ryo-ebata/ebaryo.dev',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://ebaryo.dev',
  /** Search Console等のサイト所有権確認コード。未設定なら該当メタタグは出力しない。 */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};
