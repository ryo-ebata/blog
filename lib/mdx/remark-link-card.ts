import type { Link, Paragraph, Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const FIRST_ELEMENT_INDEX = 0;
const SINGLE_ELEMENT_LENGTH = 1;

/**
 * MDX JSXノードを生成
 */
const createContentLinkCardNode = (url: string) => ({
  attributes: [
    {
      name: 'url',
      type: 'mdxJsxAttribute',
      value: url,
    },
  ],
  children: [],
  name: 'ContentLinkCard',
  type: 'mdxJsxFlowElement',
});

/**
 * 外部URLかどうかを判定
 */
const isExternalUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://');

/**
 * URLパターンにマッチするかを判定
 */
const isUrlPattern = (text: string): boolean => /^https?:\/\/[^\s]+$/.test(text);

/**
 * 空白以外の子要素を抽出
 */
const getNonWhitespaceChildren = (children: Paragraph['children']) =>
  children.filter((child) => {
    if (child.type === 'text') {
      return (child as Text).value.trim() !== '';
    }
    return true;
  });

/**
 * リンク要素を処理してContentLinkCardに変換
 */
const processLinkElement = (
  nonWhitespaceChildren: Paragraph['children'],
  parent: Root,
  index: number
): boolean => {
  const firstChild = nonWhitespaceChildren[FIRST_ELEMENT_INDEX];
  if (firstChild.type !== 'link') {
    return false;
  }

  const link = firstChild as Link;
  const { url } = link;

  if (isExternalUrl(url)) {
    (parent.children as unknown[])[index] = createContentLinkCardNode(url);
    return true;
  }
  return false;
};

/**
 * テキスト要素（Autolink）を処理してContentLinkCardに変換
 */
const processTextElement = (
  nonWhitespaceChildren: Paragraph['children'],
  parent: Root,
  index: number
): void => {
  const firstChild = nonWhitespaceChildren[FIRST_ELEMENT_INDEX];
  if (firstChild.type !== 'text') {
    return;
  }

  const text = (firstChild as Text).value.trim();

  if (isUrlPattern(text)) {
    (parent.children as unknown[])[index] = createContentLinkCardNode(text);
  }
};

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
    if (index === undefined || !parent) {
      return;
    }

    const nonWhitespaceChildren = getNonWhitespaceChildren(node.children);

    if (nonWhitespaceChildren.length !== SINGLE_ELEMENT_LENGTH) {
      return;
    }

    /* 単一のリンク要素の場合 */
    const processed = processLinkElement(nonWhitespaceChildren, parent as Root, index);
    if (processed) {
      return;
    }

    /* Autolink（URLがそのまま書かれている）の場合 */
    processTextElement(nonWhitespaceChildren, parent as Root, index);
  });
};
