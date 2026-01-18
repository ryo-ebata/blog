import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * MDXのコードブロックメタ情報をdata属性として保持するrehypeプラグイン
 *
 * MDXの ```typescript title="app.ts" showLineNumbers {1,3-5}
 * の形式からメタ情報を抽出し、pre要素のdata-meta属性に設定する
 */
export const rehypeCodeMeta = () => (tree: Root) => {
  visit(tree, 'element', (node) => {
    if (node.tagName !== 'pre') {
      return;
    }

    const codeElement = node.children.find(
      (child) => child.type === 'element' && child.tagName === 'code'
    );

    if (!codeElement || codeElement.type !== 'element') {
      return;
    }

    const meta = (codeElement.data as { meta?: string } | undefined)?.meta;

    if (meta) {
      node.properties = node.properties || {};
      node.properties['data-meta'] = meta;
    }
  });
};
