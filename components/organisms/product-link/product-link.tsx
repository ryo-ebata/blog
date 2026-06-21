import { Badge } from '@/components/atoms/badge';
import { Separator } from '@/components/atoms/separator';
import { StoreButtons } from '@/components/molecules/store-buttons/store-buttons';
import { resolveStoreLinks } from '@/config/ads';

/**
 * microCMS本文に書く商品リンクカード。カエレバ／ポチップ相当。
 *
 * 使い方（記事本文にこのタグを書く）:
 *   <product-link name="商品名" asin="B0XXXXXXX" image="https://..." desc="ひとこと"></product-link>
 *
 * - name（必須）: 商品名。各ストアの検索リンク生成に使う。
 * - asin（任意）: AmazonのASIN。あればAmazonは検索でなく直リンクになる。
 * - rakuten / yahoo（任意）: 各ストアの商品ページURL直指定。
 * - image / desc（任意）: 商品画像URL・ひとこと説明。
 */
export interface ProductLinkProps {
  name?: string;
  asin?: string;
  rakuten?: string;
  yahoo?: string;
  image?: string;
  desc?: string;
}

export function ProductLink({ name, asin, rakuten, yahoo, image, desc }: ProductLinkProps) {
  const links = resolveStoreLinks({
    name,
    amazonAsin: asin,
    rakutenUrl: rakuten,
    yahooUrl: yahoo,
  });

  // 商品名も直リンクも無ければ何も出さない
  if (!name && links.length === 0) {
    return null;
  }

  return (
    <div className="not-prose article-card my-6 flex flex-col">
      <div className="flex gap-4 p-4">
        {image && (
          // 外部の任意ドメイン画像のため next/image ではなく img を使用
          // oxlint-disable-next-line
          <img
            src={image}
            alt={name ?? ''}
            loading="lazy"
            className="size-24 shrink-0 rounded-lg bg-muted object-contain ring-1 ring-foreground/10"
          />
        )}
        <div className="min-w-0 flex-1">
          <Badge variant="outline" className="mb-1.5">
            PR
          </Badge>
          {name && <p className="text-sm font-semibold text-foreground">{name}</p>}
          {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
        </div>
      </div>
      <Separator />
      <div className="p-4">
        <StoreButtons links={links} productName={name} placement="article-product" />
      </div>
    </div>
  );
}
