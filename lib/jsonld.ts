import { siteConfig } from '@/config/site';
import type { PostMetadata } from './posts';

/**
 * ブログ記事用のJSON-LDスキーマを生成
 */
export function generateArticleJsonLd(
  metadata: PostMetadata,
  url: string
): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: metadata.author || 'Author',
    },
    dateModified: metadata.updatedAt || metadata.createdAt,
    datePublished: metadata.createdAt,
    description: metadata.description || siteConfig.description,
    headline: metadata.title,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url,
  };

  // タグがある場合はkeywordsに追加
  if (metadata.tags && metadata.tags.length > 0) {
    jsonLd.keywords = metadata.tags.join(', ');
  }

  return jsonLd;
}

/**
 * サイト全体用のJSON-LDスキーマを生成
 */
export function generateWebSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: siteConfig.description,
    name: siteConfig.name,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    url: siteConfig.url,
  };
}

/**
 * 組織（Organization）用のJSON-LDスキーマを生成
 */
export function generateOrganizationJsonLd(): Record<string, unknown> {
  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  };

  // ソーシャルリンクがある場合はsameAsに追加
  const sameAs: string[] = [];
  if (siteConfig.links.twitter) {
    sameAs.push(siteConfig.links.twitter);
  }
  if (siteConfig.links.github) {
    sameAs.push(siteConfig.links.github);
  }
  if (siteConfig.links.zenn) {
    sameAs.push(siteConfig.links.zenn);
  }
  if (siteConfig.links.qiita) {
    sameAs.push(siteConfig.links.qiita);
  }

  if (sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  return organization;
}
