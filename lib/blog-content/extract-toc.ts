import type { Element, Root } from 'hast';
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
 * 構築済みhastから h2/h3 見出しの目次（id・テキスト・深さ）を抽出する。
 * content-renderer が同じhast(共通パイプラインのrehype-slug適用済み)から直接呼ぶため、
 * 生成される id は本文側のアンカーと必ず一致し、Markdownの再パースも発生しない。
 */
export const extractToc = (hast: Root): TocItem[] => {
  const items: TocItem[] = [];
  visit(hast, 'element', (node) => {
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
