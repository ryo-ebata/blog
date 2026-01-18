import type { Link, Paragraph, Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * 段落内に単独のリンクのみが含まれている場合、
 * ContentLinkCardコンポーネントに変換するremarkプラグイン
 *
 * 例:
 * - `https://example.com` → ContentLinkCardに変換
 * - `[リンク](https://example.com)` (単独行) → ContentLinkCardに変換
 * - `これは[リンク](https://example.com)です` → そのまま（インライン）
 */
export const remarkLinkCard: Plugin<[], Root> = () => (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (index === undefined || !parent) return;

      // 段落の子要素を確認
      const children = node.children;

      // 単一のリンクのみ、または空白+リンク+空白のパターンを検出
      const nonWhitespaceChildren = children.filter((child) => {
        if (child.type === 'text') {
          return (child as Text).value.trim() !== '';
        }
        return true;
      });

      // 単一のリンク要素のみの場合
      if (nonWhitespaceChildren.length === 1 && nonWhitespaceChildren[0].type === 'link') {
        const link = nonWhitespaceChildren[0] as Link;
        const url = link.url;

        // 外部リンクのみ対象（httpまたはhttpsで始まる）
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return;
        }

        // MDX JSXノードに変換
        (parent.children as unknown[])[index] = {
          type: 'mdxJsxFlowElement',
          name: 'ContentLinkCard',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'url',
              value: url,
            },
          ],
          children: [],
        };
      }

      // autolink（URLがそのまま書かれている）の場合も対応
      if (nonWhitespaceChildren.length === 1 && nonWhitespaceChildren[0].type === 'text') {
        const text = (nonWhitespaceChildren[0] as Text).value.trim();

        // URLパターンにマッチするか確認
        if (/^https?:\/\/[^\s]+$/.test(text)) {
          (parent.children as unknown[])[index] = {
            type: 'mdxJsxFlowElement',
            name: 'ContentLinkCard',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'url',
                value: text,
              },
            ],
            children: [],
          };
        }
      }
    });
  };
