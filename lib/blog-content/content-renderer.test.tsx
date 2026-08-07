import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Root } from 'hast';
import { renderMarkdownContent } from './content-renderer';

vi.mock('./rehype-shiki', () => ({
  applyShikiHighlight: vi.fn().mockImplementation((tree: Root) => Promise.resolve(tree)),
}));

const SLUG = 'test-post';

describe('renderMarkdownContent', () => {
  it('基本的なMarkdownがReact要素に変換される', async () => {
    const markdown = 'Hello World';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain('Hello World');
  });

  it('見出しにIDが付与され（rehype-slug）、同じhastからtocも抽出される', async () => {
    const markdown = '## テスト見出し';
    const { content, toc } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain('id=');
    expect(markup).toContain('テスト見出し');
    expect(toc).toEqual([{ id: 'テスト見出し', text: 'テスト見出し', depth: 2 }]);
  });

  it('単独URLリンクがlink-cardに変換される', async () => {
    const markdown = 'https://example.com';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain('example.com');
  });

  it('複数の要素を含むMarkdownが正しく変換される', async () => {
    const markdown = `## 見出し\n\n段落テキスト\n\n> 引用テキスト\n`;
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain('見出し');
    expect(markup).toContain('段落テキスト');
    expect(markup).toContain('引用テキスト');
  });

  it('空のMarkdownでもエラーにならない', async () => {
    const { content, toc } = await renderMarkdownContent('', SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toBeDefined();
    expect(toc).toEqual([]);
  });

  it('相対パスの画像が配信URL(/blog-assets/{slug}/...)に変換される', async () => {
    const markdown = '![alt](images/eyecatch.png)';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain(`/blog-assets/${SLUG}/images/eyecatch.png`);
  });

  it('product-linkタグが各ストアの検索リンクカードに変換される', async () => {
    const markdown = '<product-link name="テスト商品"></product-link>';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

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
    const markdown = '<product-link name="商品" asin="B000000000"></product-link>';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain('amazon.co.jp/dp/B000000000');
  });

  it('tableがスマホ表示でも幅を超えないよう横スクロール可能なコンテナで囲まれる', async () => {
    const markdown = '| 見出し |\n| --- |\n| セル |\n';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain('overflow-x-auto');
    expect(markup).toContain('セル');
  });
});
