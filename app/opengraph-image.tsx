import { ImageResponse } from 'next/og';
import { OgImageElement } from '@/lib/og/og-image-element';
import { OG_IMAGE_SIZE } from '@/lib/og/og-params';
import { loadOgFont } from '@/lib/og/og-font';
import { siteConfig } from '@/config/site';

export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';
export const alt = siteConfig.name;

const Image = async () => {
  const fontData = await loadOgFont();

  return new ImageResponse(
    <OgImageElement title={siteConfig.name} subtitle={siteConfig.description} />,
    {
      ...size,
      fonts: [
        {
          data: fontData,
          name: 'Noto Sans JP',
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
};

export default Image;
