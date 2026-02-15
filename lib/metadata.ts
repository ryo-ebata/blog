import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

interface BaseMetadataParams {
  description: string;
  image?: string;
  imageAlt?: string;
  title: string;
  type?: 'article' | 'website';
  url?: string;
}

interface ArticleMetadataParams extends BaseMetadataParams {
  modifiedTime?: string;
  publishedTime?: string;
  tags?: string[];
  type: 'article';
}

type MetadataParams = ArticleMetadataParams | BaseMetadataParams;

const isArticleMetadata = (params: MetadataParams): params is ArticleMetadataParams =>
  params.type === 'article';

/**
 * OGP画像のURLを生成
 */
const getOgImageUrl = (image?: string): string => {
  if (image) {
    if (image.startsWith('http')) {
      return image;
    }
    return `${siteConfig.url}${image}`;
  }
  return `${siteConfig.url}${siteConfig.ogImage}`;
};

/**
 * OGタイトルを生成
 */
const getOgTitle = (title: string, type: 'article' | 'website'): string => {
  if (type === 'article') {
    return title;
  }
  return `${title} | ${siteConfig.name}`;
};

/**
 * 共通のメタデータを生成
 */
export const generateMetadata = (params: MetadataParams): Metadata => {
  const { description, image, imageAlt, title, type = 'website', url } = params;

  const ogImageUrl = getOgImageUrl(image);
  const pageUrl = url || siteConfig.url;
  const ogTitle = getOgTitle(title, type);
  const imageAltText = imageAlt || title;

  const baseMetadata: Metadata = {
    description,
    openGraph: {
      description,
      images: [
        {
          alt: imageAltText,
          height: OG_IMAGE_HEIGHT,
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
        },
      ],
      locale: 'ja_JP',
      siteName: siteConfig.name,
      title: ogTitle,
      type,
      url: pageUrl,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [ogImageUrl],
      title: ogTitle,
    },
  };

  /* 記事タイプの場合は追加のメタデータを設定 */
  if (isArticleMetadata(params)) {
    const openGraph: NonNullable<Metadata['openGraph']> = {
      ...baseMetadata.openGraph,
      modifiedTime: params.modifiedTime,
      publishedTime: params.publishedTime,
      tags: params.tags,
      type: 'article',
    };
    baseMetadata.openGraph = openGraph;
  }

  return baseMetadata;
};
