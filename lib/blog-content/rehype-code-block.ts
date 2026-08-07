import type { Element, Root, Text } from 'hast';
import { visit } from 'unist-util-visit';

const extractLanguage = (codeElement: Element): string => {
  const classNames = codeElement.properties?.className;
  if (!Array.isArray(classNames)) {
    return 'plaintext';
  }

  for (const className of classNames) {
    if (typeof className === 'string' && className.startsWith('language-')) {
      return className.replace('language-', '');
    }
  }

  return 'plaintext';
};

const getTextContent = (node: Element): string => {
  const texts: string[] = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      texts.push((child as Text).value);
    }
    if (child.type === 'element') {
      texts.push(getTextContent(child as Element));
    }
  }
  return texts.join('');
};

const extractMeta = (codeElement: Element): string | undefined =>
  (codeElement.data as { meta?: string } | undefined)?.meta;

/**
 * Markdownのfenced code block(pre > code)を、シンタックスハイライトと
 * コピーボタン等の表示を自前で行うCodeBlockコンポーネントへ渡すため、
 * lang/meta/codeを持つcode-block要素に変換する。
 */
export const rehypeCodeBlock = () => (tree: Root) => {
  visit(tree, 'element', (node: Element, index, parent) => {
    if (node.tagName !== 'pre' || index === undefined || !parent) {
      return;
    }

    const codeElement = node.children.find(
      (child): child is Element => child.type === 'element' && child.tagName === 'code'
    );
    if (!codeElement) {
      return;
    }

    const lang = extractLanguage(codeElement);
    const code = getTextContent(codeElement);
    const meta = extractMeta(codeElement);

    parent.children[index] = {
      type: 'element',
      tagName: 'code-block',
      properties: { lang, ...(meta ? { meta } : {}) },
      children: [{ type: 'text', value: code }],
    };
  });
};
