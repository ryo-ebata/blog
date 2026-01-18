import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface BaseMetadataParams {
  title: string;
  description: string;
  url?: string;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
}

interface ArticleMetadataParams extends BaseMetadataParams {
  type: 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

type MetadataParams = BaseMetadataParams | ArticleMetadataParams;

/**
 * OGP画像のURLを生成
 */
function getOgImageUrl(image?: string): string {
  return image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.ogImage}`;
}

/**
 * 共通のメタデータを生成
 */
export function generateMetadata(params: MetadataParams): Metadata {
  const { title, description, url, type = 'website', image, imageAlt } = params;

  const ogImageUrl = getOgImageUrl(image);
  const pageUrl = url || siteConfig.url;
  const ogTitle = type === 'article' ? title : `${title} | ${siteConfig.name}`;
  const imageAltText = imageAlt || title;

  const baseMetadata: Metadata = {
    description,
    openGraph: {
      type,
      locale: 'ja_JP',
      url: pageUrl,
      title: ogTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAltText,
        },
      ],
    },
    title,
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [ogImageUrl],
    },
  };

  // 記事タイプの場合は追加のメタデータを設定
  if (type === 'article' && 'publishedTime' in params) {
    const articleParams = params as ArticleMetadataParams;
    baseMetadata.openGraph = {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime: articleParams.publishedTime,
      modifiedTime: articleParams.modifiedTime,
      authors: articleParams.authors,
      tags: articleParams.tags,
    } as Metadata['openGraph'];
  }

  return baseMetadata;
}
