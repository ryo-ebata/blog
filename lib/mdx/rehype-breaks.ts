import type { Element, Root, Text } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * NOTE: テキストノード内の改行を <br /> タグに変換するrehypeプラグイン
 * リスト要素（ol, ul）内のテキストノードは除外する
 * テーブル要素（table, thead, tbody, tfoot, tr, th, td）内のテキストノードも除外する
 */
export const rehypeBreaks: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (typeof node.value === 'string' && node.value.includes('\n')) {
        // 親要素がリスト要素（ol, ul）またはリスト項目（li）の場合はスキップ
        // テーブル要素（table, thead, tbody, tfoot, tr, th, td）の場合もスキップ
        if (parent && parent.type === 'element') {
          const tagName = parent.tagName;
          if (
            tagName === 'ol' ||
            tagName === 'ul' ||
            tagName === 'li' ||
            tagName === 'table' ||
            tagName === 'thead' ||
            tagName === 'tbody' ||
            tagName === 'tfoot' ||
            tagName === 'tr' ||
            tagName === 'th' ||
            tagName === 'td'
          ) {
            return;
          }
        }

        const parts = node.value.split('\n');

        if (parent && Array.isArray(parent.children) && typeof index === 'number') {
          const newNodes: Array<Text | Element> = [];

          for (let i = 0; i < parts.length; i++) {
            if (parts[i] !== undefined && parts[i] !== '') {
              const textNode: Text = {
                type: 'text',
                value: parts[i],
              };
              newNodes.push(textNode);
            }
            if (i < parts.length - 1) {
              const brElement: Element = {
                type: 'element',
                tagName: 'br',
                properties: {},
                children: [],
              };
              newNodes.push(brElement);
            }
          }

          if (newNodes.length > 0) {
            parent.children.splice(index, 1, ...newNodes);
            return index + newNodes.length;
          }
        }
      }
    });
  };
};
