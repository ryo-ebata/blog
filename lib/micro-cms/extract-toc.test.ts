import { describe, expect, it } from 'vitest';

import { extractToc } from './extract-toc';

describe('extractToc', () => {
  it('h2/h3 を id・テキスト・深さ付きで抽出する', () => {
    const html = '<h2>はじめに</h2><p>x</p><h3>背景</h3><h2>まとめ</h2>';
    expect(extractToc(html)).toEqual([
      { id: 'はじめに', text: 'はじめに', depth: 2 },
      { id: '背景', text: '背景', depth: 3 },
      { id: 'まとめ', text: 'まとめ', depth: 2 },
    ]);
  });

  it('h1/h4 以下は対象外', () => {
    const html = '<h1>title</h1><h2>sec</h2><h4>sub</h4>';
    expect(extractToc(html).map((i) => i.text)).toEqual(['sec']);
  });

  it('重複見出しでも id が一意になり本文アンカーと整合する', () => {
    const items = extractToc('<h2>Note</h2><h2>Note</h2>');
    expect(items.map((i) => i.id)).toEqual(['note', 'note-1']);
  });

  it('見出しが無ければ空配列', () => {
    expect(extractToc('<p>本文のみ</p>')).toEqual([]);
  });
});
