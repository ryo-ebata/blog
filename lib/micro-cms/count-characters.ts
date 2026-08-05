import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { visit } from 'unist-util-visit';
import type { Element, Text, Root } from 'hast';

const EXCLUDED_TAG_NAMES = new Set(['pre', 'code']);

const isElement = (node: unknown): node is Element => {
  return (node as Element).type === 'element';
};

const isTextNode = (node: unknown): node is Text => {
  return (node as Text).type === 'text';
};

const extractTextFromHast = (tree: Root): string => {
  const texts: string[] = [];

  visit(tree, (node, _index, parent) => {
    if (isTextNode(node)) {
      if (isElement(parent) && EXCLUDED_TAG_NAMES.has(parent.tagName)) {
        return;
      }
      texts.push(node.value);
    }
  });

  return texts.join('');
};

/** HTML から pre/code を除いたプレーンテキストを抽出する(空白正規化済み)。 */
export const extractPlainText = (html: string): string => {
  if (!html) {
    return '';
  }
  const tree = unified().use(rehypeParse, { fragment: true }).parse(html);
  return extractTextFromHast(tree).replace(/\s+/g, ' ').trim();
};

export const countHtmlCharacters = (html: string): number => extractPlainText(html).length;
