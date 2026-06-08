/**
 * 収益化（Google AdSense / アフィリエイト）設定ハブ。
 *
 * すべて NEXT_PUBLIC_* 環境変数から読み込むため、サーバー/クライアント両方で参照可能。
 * 各IDが未設定（空文字）のとき、対応する広告枠は自動的に非表示になる。
 * 商品・バナーは下部の配列に追記して増やす。
 */

export const adsConfig = {
  adsense: {
    /** AdSense パブリッシャーID (ca-pub-XXXX)。未設定なら全AdSense枠を非表示。 */
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? '',
    /** AdSense管理画面で発行した広告ユニットのスロットID */
    slots: {
      listInFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST ?? '',
      articleTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP ?? '',
      articleBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM ?? '',
    },
  },
  affiliate: {
    /** Amazonアソシエイトのトラッキングタグ (例: xxxx-22) */
    amazonTag: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? '',
    /** 楽天アフィリエイトID */
    rakutenId: process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? '',
    /** Yahoo!ショッピング用バリューコマースのsid/pid（未設定なら素の検索リンク） */
    valueCommerceSid: process.env.NEXT_PUBLIC_VALUECOMMERCE_SID ?? '',
    valueCommercePid: process.env.NEXT_PUBLIC_VALUECOMMERCE_PID ?? '',
  },
} as const;

/** AdSenseが有効か（パブリッシャーIDが設定済みか） */
export const isAdsenseEnabled = adsConfig.adsense.clientId !== '';

/** おすすめ商品（アフィリエイト）。1件 = 1商品。 */
export interface AffiliateItem {
  id: string;
  title: string;
  description?: string;
  /** 商品画像URL（任意） */
  imageUrl?: string;
  /** Amazon商品のASIN。amazonTagを付与してリンク生成。 */
  amazonAsin?: string;
  /** 楽天の商品ページURL。rakutenIdでアフィリリンク化。 */
  rakutenUrl?: string;
  /** Yahoo!ショッピングの商品ページURL。 */
  yahooUrl?: string;
  /** もしもアフィリエイトで発行済みの完成リンク。 */
  moshimoUrl?: string;
}

/**
 * おすすめ商品リスト。空配列の間はアフィリ枠が非表示になる。
 * ここに商品を追記すると、記事末尾と一覧カード間に自動で表示される。
 */
export const recommendedItems: AffiliateItem[] = [];

/** A8.netなどASPが発行するバナー広告（aタグ+imgタグのHTML）。 */
export interface BannerAd {
  id: string;
  /** ASPが発行した広告タグHTMLをそのまま貼る。 */
  html: string;
}

/** バナー広告リスト。空配列の間はバナー枠が非表示になる。 */
export const bannerAds: BannerAd[] = [];

/** ASINとamazonTagからAmazon商品URLを生成 */
export const buildAmazonUrl = (asin: string): string => {
  const base = `https://www.amazon.co.jp/dp/${asin}`;
  const tag = adsConfig.affiliate.amazonTag;
  return tag ? `${base}?tag=${tag}` : base;
};

/** 楽天商品URLをアフィリエイトリンクに変換（検索URLにも使える） */
export const buildRakutenUrl = (productUrl: string): string => {
  const id = adsConfig.affiliate.rakutenId;
  if (!id) {
    return productUrl;
  }
  const encoded = encodeURIComponent(productUrl);
  return `https://hb.afl.rakuten.co.jp/hgc/${id}/?pc=${encoded}&m=${encoded}`;
};

/** Yahoo!ショッピングURLをバリューコマース経由のアフィリエイトリンクに変換 */
export const buildYahooUrl = (productUrl: string): string => {
  const { valueCommerceSid: sid, valueCommercePid: pid } = adsConfig.affiliate;
  if (!sid || !pid) {
    return productUrl;
  }
  const encoded = encodeURIComponent(productUrl);
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${sid}&pid=${pid}&vc_url=${encoded}`;
};

/** 商品名からAmazon検索リンクを生成（asinが無いときのフォールバック） */
export const buildAmazonSearchUrl = (keyword: string): string => {
  const base = `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}`;
  const tag = adsConfig.affiliate.amazonTag;
  return tag ? `${base}&tag=${tag}` : base;
};

/** 商品名から楽天検索リンクを生成 */
export const buildRakutenSearchUrl = (keyword: string): string =>
  `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;

/** 商品名からYahoo!ショッピング検索リンクを生成 */
export const buildYahooSearchUrl = (keyword: string): string =>
  `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(keyword)}`;

export type StoreKey = 'amazon' | 'rakuten' | 'yahoo' | 'moshimo';

export interface StoreLink {
  store: StoreKey;
  label: string;
  href: string;
}

/** 商品リンク生成の入力（商品名 or 各ストアの直URL） */
export interface ResolveStoreInput {
  /** 商品名（キーワード）。各ストアの検索リンク生成に使う。 */
  name?: string;
  amazonAsin?: string;
  rakutenUrl?: string;
  yahooUrl?: string;
  moshimoUrl?: string;
}

/**
 * 1つの入力から Amazon / 楽天 / Yahoo（+もしも）のリンクをまとめて生成する。
 * 直URLがあれば直リンク、無ければ商品名から各ストアの検索リンクを作る。
 * カエレバ／ポチップ的な「1入力 → 全ストアのリンク」を実現する中核関数。
 */
export const resolveStoreLinks = (input: ResolveStoreInput): StoreLink[] => {
  const { name, amazonAsin, rakutenUrl, yahooUrl, moshimoUrl } = input;
  const links: StoreLink[] = [];

  const amazonHref = amazonAsin
    ? buildAmazonUrl(amazonAsin)
    : name
      ? buildAmazonSearchUrl(name)
      : undefined;
  if (amazonHref) {
    links.push({ store: 'amazon', label: 'Amazon', href: amazonHref });
  }

  const rakutenHref = rakutenUrl
    ? buildRakutenUrl(rakutenUrl)
    : name
      ? buildRakutenUrl(buildRakutenSearchUrl(name))
      : undefined;
  if (rakutenHref) {
    links.push({ store: 'rakuten', label: '楽天', href: rakutenHref });
  }

  const yahooHref = yahooUrl
    ? buildYahooUrl(yahooUrl)
    : name
      ? buildYahooUrl(buildYahooSearchUrl(name))
      : undefined;
  if (yahooHref) {
    links.push({ store: 'yahoo', label: 'Yahoo', href: yahooHref });
  }

  if (moshimoUrl) {
    links.push({ store: 'moshimo', label: 'もしも', href: moshimoUrl });
  }

  return links;
};
