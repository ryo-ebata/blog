import { cache } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

/**
 * Markdownからプレーンテキストを抽出する(空白正規化済み)。
 * mdastではコードブロック/インラインコード/生HTMLはtext型ノードにならないため、
 * text型ノードのみを収集すれば自然に除外される。
 * 同一リクエスト内でmetadata生成とJSON-LD生成が同じcontentMarkdownを解析するため、
 * cache()でリクエストスコープのメモ化を行い重複パースを避ける。
 */
export const extractPlainText = cache((markdown: string): string => {
  if (!markdown) {
    return '';
  }
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const texts: string[] = [];
  visit(tree, 'text', (node) => {
    texts.push(node.value);
  });
  return texts.join('').replace(/\s+/g, ' ').trim();
});

export const countMarkdownCharacters = (markdown: string): number =>
  extractPlainText(markdown).length;
