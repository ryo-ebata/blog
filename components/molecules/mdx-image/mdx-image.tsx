import Image from 'next/image';

import type { MdxImageProps } from './types';

/* 記事本文(article)のprose最大幅(app/blog/[...slug]/container.tsx の max-w-[42rem])に合わせる */
const CONTENT_MAX_WIDTH = 672;

export const MdxImage = ({ alt = '', height, src, width }: MdxImageProps) => {
  const numericWidth = width ? Number(width) : undefined;
  const numericHeight = height ? Number(height) : undefined;

  if (!src || !numericWidth || !numericHeight) {
    /* 外部URL等、ビルド時に実寸を取得できなかった画像はnext/imageの最適化を諦め、
       素のimgでそのまま表示する(remark-resolve-imagesを参照) */
    return <img src={src} alt={alt} loading="lazy" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={numericWidth}
      height={numericHeight}
      sizes={`(min-width: ${CONTENT_MAX_WIDTH}px) ${CONTENT_MAX_WIDTH}px, 100vw`}
      className="h-auto w-full rounded-xl"
    />
  );
};
