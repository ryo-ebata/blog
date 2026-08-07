import { describe, expect, it } from 'vitest';
import { countMarkdownCharacters } from './extract-text';

describe('countMarkdownCharacters', () => {
  it('プレーンテキストの文字数をカウントする', () => {
    const markdown = 'こんにちは世界';
    expect(countMarkdownCharacters(markdown)).toBe(7);
  });

  it('複数の段落の文字数をカウントする', () => {
    const markdown = 'Hello\n\nWorld';
    expect(countMarkdownCharacters(markdown)).toBe(10);
  });

  it('フェンスコードブロックのテキストを除外する', () => {
    const markdown = '本文テキスト\n\n```\nconst x = 1;\n```\n';
    expect(countMarkdownCharacters(markdown)).toBe(6);
  });

  it('インラインコードのテキストを除外する', () => {
    const markdown = 'テキスト`inline code`続き';
    expect(countMarkdownCharacters(markdown)).toBe(6);
  });

  it('空白を正規化してカウントする', () => {
    const markdown = 'Hello   World';
    expect(countMarkdownCharacters(markdown)).toBe(11);
  });

  it('空のMarkdownの場合0を返す', () => {
    expect(countMarkdownCharacters('')).toBe(0);
  });

  it('ネストされた要素を正しく処理する', () => {
    const markdown = '**太字**と*斜体*';
    expect(countMarkdownCharacters(markdown)).toBe(5);
  });

  it('生HTMLのテキストを除外する', () => {
    const markdown = '前文\n\n<product-link name="商品"></product-link>\n\n後文';
    expect(countMarkdownCharacters(markdown)).toBe(4);
  });

  it('リスト要素のテキストをカウントする', () => {
    const markdown = '- 項目1\n- 項目2\n';
    expect(countMarkdownCharacters(markdown)).toBe(6);
  });
});
