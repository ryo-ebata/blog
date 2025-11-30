import type { Text } from 'mdast';
import ogs from 'open-graph-scraper';
import type { Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { siteConfig } from '@/config/site';

const URL_REGEXP =
  /^https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+$/g;
const MY_HOST = new URL(siteConfig.url).hostname;

type LinkNode = Parent & {
  children: (Text | Parent)[];
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

const fetchMeta = async (url: string, retries = 3): Promise<Meta | null> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // タイムアウトを設定（30秒）
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 30000);
      });

      const metadataPromise = ogs({ url, timeout: 30000 });
      const result = await Promise.race([metadataPromise, timeoutPromise]);

      if (result.error) {
        throw new Error(String(result.error));
      }

      const metadata = result.result;

      // ファビコンを取得（ドメインから推測）
      let icon = '';
      try {
        const domain = new URL(url);
        icon = `${domain.protocol}//${domain.hostname}/favicon.ico`;
      } catch {
        // URL解析に失敗した場合は空文字列
      }

      return {
        url: metadata.ogUrl || metadata.requestUrl || url,
        title: metadata.ogTitle || metadata.twitterTitle || metadata.dcTitle || url,
        description:
          metadata.ogDescription || metadata.twitterDescription || metadata.dcDescription || '',
        image: metadata.ogImage?.[0]?.url || metadata.twitterImage?.[0]?.url || '',
        icon: metadata.favicon || icon,
      };
    } catch (error) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) {
        console.error(`Failed to fetch metadata for ${url} after ${retries} attempts:`, error);
        return null;
      }
      // リトライ前に少し待機（指数バックオフ）
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return null;
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
    .map((c) => {
      if (c.type === 'text') {
        return (c as Text).value;
      }
      return '';
    })
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

        const domain = new URL(url);
        const isExternal = domain.hostname !== MY_HOST;

        // メタデータが取得できない場合でも、最低限の情報でリンクカードを表示
        const title = meta?.title || url;
        const description = meta?.description || '';
        const image = meta?.image || '';
        const icon = meta?.icon || '';

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
              children: [{ type: 'text', value: title }],
            },
          ],
        };

        if (description) {
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
            children: [{ type: 'text', value: description }],
          });
        }

        const cardElement: JsxElement = {
          type: 'mdxJsxFlowElement',
          name: 'LinkCard',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'href', value: url },
            { type: 'mdxJsxAttribute', name: 'isExternal', value: isExternal },
            { type: 'mdxJsxAttribute', name: 'title', value: title },
            { type: 'mdxJsxAttribute', name: 'description', value: description },
            { type: 'mdxJsxAttribute', name: 'image', value: image },
            { type: 'mdxJsxAttribute', name: 'icon', value: icon },
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
