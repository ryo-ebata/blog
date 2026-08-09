import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import type { Plugin } from 'unified';
import { isResolvedUrl, resolveAssetUrl, slugToArticleDir } from './paths';

interface RemarkResolveImagesOptions {
  slug: string;
}

interface ImageDimensions {
  height: number;
  width: number;
}

/* ローカル画像(相対パス)は実ファイルを読んで実寸を取得し、hast要素のwidth/height
   属性(next/imageのCLS防止に必須)へ埋め込む。外部URLや読み取り不能なファイルは
   undefinedを返し、呼び出し側でサイズ無しの<img>フォールバックに委ねる */
const getLocalImageDimensions = (
  slug: string,
  relativeUrl: string
): ImageDimensions | undefined => {
  const absolutePath = path.join(slugToArticleDir(slug), relativeUrl);
  if (!existsSync(absolutePath)) {
    return undefined;
  }
  try {
    const { width, height } = imageSize(readFileSync(absolutePath));
    return { width, height };
  } catch {
    return undefined;
  }
};

/** 記事本文中の相対画像パス(images/foo.png)を配信URL(/blog-assets/{slug}/images/foo.png)に書き換え、
    ローカル画像は実寸をhast要素のwidth/height属性として埋め込む(mdast-util-to-hastのdata.hPropertiesを利用) */
export const remarkResolveImages: Plugin<[RemarkResolveImagesOptions], Root> = ({ slug }) => {
  return (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      const dimensions = isResolvedUrl(node.url)
        ? undefined
        : getLocalImageDimensions(slug, node.url);
      node.url = resolveAssetUrl(slug, node.url);
      if (dimensions) {
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, ...dimensions },
        };
      }
    });
  };
};
