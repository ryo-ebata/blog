import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Root } from 'hast';
import { renderMicroCMSContent } from './content-renderer';

vi.mock('./rehype-shiki', () => ({
  applyShikiHighlight: vi.fn().mockImplementation((tree: Root) => Promise.resolve(tree)),
}));

describe('renderMicroCMSContent', () => {
  it('基本的なHTMLがReact要素に変換される', async () => {
    const html = '<p>Hello World</p>';
    const result = await renderMicroCMSContent(html);
    const markup = renderToStaticMarkup(result);

    expect(markup).toContain('Hello World');
  });

  it('見出しにIDが付与される（rehype-slug）', async () => {
    const html = '<h2>テスト見出し</h2>';
    const result = await renderMicroCMSContent(html);
    const markup = renderToStaticMarkup(result);

    expect(markup).toContain('id=');
    expect(markup).toContain('テスト見出し');
  });

  it('単独URLリンクがlink-cardに変換される', async () => {
    const html = '<p><a href="https://example.com">https://example.com</a></p>';
    const result = await renderMicroCMSContent(html);
    const markup = renderToStaticMarkup(result);

    expect(markup).toContain('example.com');
  });

  it('複数の要素を含むHTMLが正しく変換される', async () => {
    const html = `
      <h2>見出し</h2>
      <p>段落テキスト</p>
      <blockquote>引用テキスト</blockquote>
    `;
    const result = await renderMicroCMSContent(html);
    const markup = renderToStaticMarkup(result);

    expect(markup).toContain('見出し');
    expect(markup).toContain('段落テキスト');
    expect(markup).toContain('引用テキスト');
  });

  it('空のHTMLでもエラーにならない', async () => {
    const result = await renderMicroCMSContent('');
    const markup = renderToStaticMarkup(result);

    expect(markup).toBeDefined();
  });

  it('product-linkタグが各ストアの検索リンクカードに変換される', async () => {
    const html = '<product-link name="テスト商品"></product-link>';
    const result = await renderMicroCMSContent(html);
    const markup = renderToStaticMarkup(result);

    // 商品名が表示される（propsが渡っている）
    expect(markup).toContain('テスト商品');
    // Amazon / 楽天 / Yahoo の検索リンクが生成される
    expect(markup).toContain('amazon.co.jp/s?k=');
    expect(markup).toContain('search.rakuten.co.jp');
    expect(markup).toContain('shopping.yahoo.co.jp');
    // アフィリエイトリンクの rel が付与される
    expect(markup).toContain('sponsored');
  });

  it('product-linkにasin指定でAmazonが直リンクになる', async () => {
    const html = '<product-link name="商品" asin="B000000000"></product-link>';
    const result = await renderMicroCMSContent(html);
    const markup = renderToStaticMarkup(result);

    expect(markup).toContain('amazon.co.jp/dp/B000000000');
  });

  it('tableがスマホ表示でも幅を超えないよう横スクロール可能なコンテナで囲まれる', async () => {
    const html = '<table><tbody><tr><td>セル</td></tr></tbody></table>';
    const result = await renderMicroCMSContent(html);
    const markup = renderToStaticMarkup(result);

    expect(markup).toContain('overflow-x-auto');
    expect(markup).toContain('セル');
  });
});
