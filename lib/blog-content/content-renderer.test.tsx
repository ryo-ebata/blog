import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup, renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import type { ReactNode } from 'react';
import { renderMarkdownContent } from './content-renderer';

/* デフォルトは「実ファイルなし」= 既存の画像テストはフォールバック(素のimg)のまま動く。
   実寸を検証したいテストだけmockReturnValueOnceで個別に上書きする。 */
const { existsSyncMock, readFileSyncMock, imageSizeMock } = vi.hoisted(() => ({
  existsSyncMock: vi.fn().mockReturnValue(false),
  readFileSyncMock: vi.fn(),
  imageSizeMock: vi.fn(),
}));

vi.mock('node:fs', () => ({
  default: { existsSync: existsSyncMock, readFileSync: readFileSyncMock },
  existsSync: existsSyncMock,
  readFileSync: readFileSyncMock,
}));

vi.mock('image-size', () => ({
  imageSize: imageSizeMock,
}));

/**
 * CodeBlockはSuspense境界のないasyncサーバーコンポーネントのため、
 * 同期APIのrenderToStaticMarkupではサスペンドしてエラーになる。
 * pipeable streamで非同期解決を待ってからHTML文字列化する。
 */
const renderToMarkupAsync = (node: ReactNode): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const passThrough = new PassThrough();
    passThrough.on('data', (chunk: Buffer) => chunks.push(chunk));
    passThrough.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    passThrough.on('error', reject);

    const { pipe } = renderToPipeableStream(node, {
      onAllReady() {
        pipe(passThrough);
      },
      onError: reject,
    });
  });

vi.mock('@/lib/shiki/highlighter', () => ({
  getHighlighter: vi.fn().mockResolvedValue({
    codeToHast: vi.fn().mockReturnValue({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: { class: 'shiki github-dark github-light' },
          children: [
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { class: 'line' },
                  children: [{ type: 'text', value: 'const x = 1;' }],
                },
              ],
            },
          ],
        },
      ],
    }),
  }),
  defaultTransformers: [],
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

  it('実寸が取得できたローカル画像はnext/image(width/height付き)でレンダリングされる', async () => {
    existsSyncMock.mockReturnValueOnce(true);
    readFileSyncMock.mockReturnValueOnce(new Uint8Array());
    imageSizeMock.mockReturnValueOnce({ width: 800, height: 600 });

    const markdown = '![alt text](images/photo.png)';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = renderToStaticMarkup(content);

    expect(markup).toContain('width="800"');
    expect(markup).toContain('height="600"');
    expect(markup).toContain('alt="alt text"');
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

  it('fenced code blockがCodeBlockコンポーネント(Shikiハイライト・コピーボタン付き)でレンダリングされる', async () => {
    const markdown = '```typescript\nconst x = 1;\n```\n';
    const { content } = await renderMarkdownContent(markdown, SLUG);
    const markup = await renderToMarkupAsync(content);

    expect(markup).toContain('code-block-wrapper');
    expect(markup).toContain('code-block-content');
    expect(markup).toContain('const x = 1;');
    expect(markup).toContain('コードをコピー');
  });
});
