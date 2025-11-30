import getMetadata from 'metadata-scraper';
import type { Parent, Position } from 'unist';
import { visit } from 'unist-util-visit';
import { siteConfig } from '@/config/site';

const URL_REGEXP =
  /^https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+$/g;
const MY_HOST = new URL(siteConfig.url).hostname;

type LinkNode = Parent & {
  children: { type: string; value: string; position?: Position }[];
  url: string;
  title: string | null;
};

type Meta = {
  url: string;
  title: string;
  description: string;
  image: string;
  icon: string;
};

type JsxElement = {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement';
  name: string;
  attributes: JsxAttribute[];
  children: (JsxElement | TextElement)[];
};

type TextElement = {
  type: 'text';
  value: string;
};

type JsxAttribute = {
  type: 'mdxJsxAttribute';
  name: string;
  value: string | boolean;
};

const fetchMeta = async (url: string): Promise<Meta | null> => {
  try {
    const metadata = await getMetadata(url);
    return {
      url: metadata.url || url,
      title: metadata.title || url,
      description: metadata.description || '',
      image: metadata.image || '',
      icon: metadata.icon || '',
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error);
    return null;
  }
};

/**
 * パラグラフがURLのみのリンクかどうかを判定する
 */
function isLinkOnlyParagraph(node: Parent): boolean {
  if (node.type !== 'paragraph') {
    return false;
  }

  const children = node.children;
  if (children.length !== 1) {
    return false;
  }

  const child = children[0];
  if (child.type !== 'link') {
    return false;
  }

  const linkNode = child as LinkNode;
  const url = linkNode.url;

  // URLのみの行かどうかを判定（URLの正規表現に一致し、childrenがURLと同じ値）
  URL_REGEXP.lastIndex = 0; // 正規表現の状態をリセット
  if (!URL_REGEXP.test(url)) {
    return false;
  }

  const linkText = linkNode.children
    .map((c) => (c.type === 'text' ? c.value : ''))
    .join('')
    .trim();

  return linkText === url || linkText === '';
}

type Replacement = {
  node: Parent;
  index: number;
  parent: Parent;
  newElement?: JsxElement;
};

export const remarkLinkCard = () => {
  return async (tree: Parent) => {
    const promises: Array<() => Promise<void>> = [];
    const replacements: Replacement[] = [];

    const visitor = (node: Parent, index: number | undefined, parent: Parent | undefined) => {
      if (!isLinkOnlyParagraph(node) || typeof index !== 'number' || !parent) {
        return;
      }

      const linkNode = node.children.find((n) => n.type === 'link') as LinkNode;
      const url = linkNode.url;

      const replacement: Replacement = { node, index, parent };
      replacements.push(replacement);

      promises.push(async () => {
        const meta = await fetchMeta(url);
        if (!meta) {
          return;
        }

        const domain = new URL(url);
        const isExternal = domain.hostname !== MY_HOST;

        const main: JsxElement = {
          type: 'mdxJsxFlowElement',
          name: 'div',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'className', value: 'remark-link-card-main' },
          ],
          children: [
            {
              type: 'mdxJsxTextElement',
              name: 'div',
              attributes: [
                { type: 'mdxJsxAttribute', name: 'className', value: 'remark-link-card-title' },
              ],
              children: [{ type: 'text', value: meta.title }],
            },
          ],
        };

        if (meta.description) {
          main.children.push({
            type: 'mdxJsxTextElement',
            name: 'div',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'className',
                value: 'remark-link-card-description',
              },
            ],
            children: [{ type: 'text', value: meta.description }],
          });
        }

        const cardElement: JsxElement = {
          type: 'mdxJsxFlowElement',
          name: 'LinkCard',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'href', value: meta.url },
            { type: 'mdxJsxAttribute', name: 'isExternal', value: isExternal },
            { type: 'mdxJsxAttribute', name: 'title', value: meta.title },
            { type: 'mdxJsxAttribute', name: 'description', value: meta.description },
            { type: 'mdxJsxAttribute', name: 'image', value: meta.image },
            { type: 'mdxJsxAttribute', name: 'icon', value: meta.icon },
          ],
          children: [main],
        };

        replacement.newElement = cardElement;
      });
    };

    visit(tree, 'paragraph', visitor);

    // すべてのメタデータ取得を並列実行
    await Promise.all(promises.map((p) => p()));

    // ノードを置き換え（後ろから前へ置き換えることで、インデックスのずれを防ぐ）
    replacements
      .sort((a, b) => b.index - a.index)
      .forEach((replacement) => {
        if (replacement.newElement && Array.isArray(replacement.parent.children)) {
          replacement.parent.children[replacement.index] =
            replacement.newElement as unknown as Parent;
        }
      });
  };
};
