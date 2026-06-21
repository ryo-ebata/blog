import type { Element, Root } from 'hast';
import rehypeParse from 'rehype-parse';
import rehypeSlug from 'rehype-slug';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

/** 見出し要素配下のテキストを連結して取り出す。 */
const getHeadingText = (node: Element): string => {
  let text = '';
  visit(node, 'text', (textNode) => {
    text += textNode.value;
  });
  return text.trim();
};

/**
 * 記事HTMLから h2/h3 見出しの目次（id・テキスト・深さ）を抽出する。
 * content-renderer と同じ rehype-slug を使うため、生成される id は本文側のアンカーと一致する。
 */
export const extractToc = (html: string): TocItem[] => {
  const processor = unified().use(rehypeParse, { fragment: true }).use(rehypeSlug);
  const tree = processor.runSync(processor.parse(html)) as Root;

  const items: TocItem[] = [];
  visit(tree, 'element', (node) => {
    if (node.tagName !== 'h2' && node.tagName !== 'h3') {
      return;
    }
    const id = typeof node.properties?.id === 'string' ? node.properties.id : '';
    const text = getHeadingText(node);
    if (id && text) {
      items.push({ id, text, depth: node.tagName === 'h2' ? 2 : 3 });
    }
  });
  return items;
};
