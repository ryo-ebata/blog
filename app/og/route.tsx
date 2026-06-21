import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { siteConfig } from '@/config/site';
import { loadOgFont } from '@/lib/og/og-font';
import { OgImageElement } from '@/lib/og/og-image-element';
import { OG_IMAGE_SIZE } from '@/lib/og/og-params';

export const contentType = 'image/png';

/**
 * 記事タイトルを焼き込んだ動的OG画像を生成する共通エンドポイント。
 * catch-all ルート([...slug])配下には opengraph-image を置けない(Next.js 制約)ため、
 * クエリ ?title= で生成する。eyecatch 未設定の記事の OG として metadata から参照する。
 */
export const GET = async (request: NextRequest) => {
  const title = request.nextUrl.searchParams.get('title') ?? siteConfig.name;
  const subtitle = request.nextUrl.searchParams.get('subtitle') ?? siteConfig.name;
  const fontData = await loadOgFont();

  return new ImageResponse(<OgImageElement subtitle={subtitle} title={title} />, {
    ...OG_IMAGE_SIZE,
    fonts: [
      {
        data: fontData,
        name: 'Noto Sans JP',
        style: 'normal',
        weight: 700,
      },
    ],
  });
};
