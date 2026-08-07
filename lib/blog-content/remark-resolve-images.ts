import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import type { Plugin } from 'unified';
import { resolveAssetUrl } from './paths';

interface RemarkResolveImagesOptions {
  slug: string;
}

/** 記事本文中の相対画像パス(images/foo.png)を配信URL(/blog-assets/{slug}/images/foo.png)に書き換える */
export const remarkResolveImages: Plugin<[RemarkResolveImagesOptions], Root> = ({ slug }) => {
  return (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      node.url = resolveAssetUrl(slug, node.url);
    });
  };
};
