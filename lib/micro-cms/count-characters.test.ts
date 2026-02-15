import { describe, expect, it } from 'vitest';
import { countHtmlCharacters } from './count-characters';

describe('countHtmlCharacters', () => {
  it('プレーンテキストの文字数をカウントする', () => {
    const html = '<p>こんにちは世界</p>';
    expect(countHtmlCharacters(html)).toBe(7);
  });

  it('複数の段落の文字数をカウントする', () => {
    const html = '<p>Hello</p><p>World</p>';
    expect(countHtmlCharacters(html)).toBe(10);
  });

  it('pre要素のテキストを除外する', () => {
    const html = '<p>本文テキスト</p><pre><code>const x = 1;</code></pre>';
    expect(countHtmlCharacters(html)).toBe(6);
  });

  it('code要素のテキストを除外する', () => {
    const html = '<p>テキスト<code>inline code</code>続き</p>';
    expect(countHtmlCharacters(html)).toBe(6);
  });

  it('空白を正規化してカウントする', () => {
    const html = '<p>  Hello   World  </p>';
    expect(countHtmlCharacters(html)).toBe(11);
  });

  it('空のHTMLの場合0を返す', () => {
    expect(countHtmlCharacters('')).toBe(0);
  });

  it('ネストされたHTML要素を正しく処理する', () => {
    const html = '<div><p><strong>太字</strong>と<em>斜体</em></p></div>';
    expect(countHtmlCharacters(html)).toBe(5);
  });

  it('pre内のcode要素も除外する', () => {
    const html = '<p>前文</p><pre><code>console.log("test");\nconst a = 1;</code></pre><p>後文</p>';
    expect(countHtmlCharacters(html)).toBe(4);
  });

  it('リスト要素のテキストをカウントする', () => {
    const html = '<ul><li>項目1</li><li>項目2</li></ul>';
    expect(countHtmlCharacters(html)).toBe(6);
  });
});
