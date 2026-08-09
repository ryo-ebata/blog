import { describe, expect, it, vi, beforeEach } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';
import { remarkResolveImages } from './remark-resolve-images';

const { existsSyncMock, readFileSyncMock, imageSizeMock } = vi.hoisted(() => ({
  existsSyncMock: vi.fn(),
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

const SLUG = 'sample-post';

const markdownToHast = async (markdown: string): Promise<Root> => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkResolveImages, { slug: SLUG })
    .use(remarkRehype);
  const mdast = processor.parse(markdown);
  return (await processor.run(mdast)) as Root;
};

const findElement = (tree: Root, tagName: string): Element | undefined => {
  let found: Element | undefined;
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === tagName) {
      found = node;
    }
  });
  return found;
};

describe('remarkResolveImages', () => {
  beforeEach(() => {
    existsSyncMock.mockReset();
    readFileSyncMock.mockReset();
    imageSizeMock.mockReset();
  });

  it('ローカル画像は配信URLへ解決され、実寸がwidth/heightへ埋め込まれる', async () => {
    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(new Uint8Array());
    imageSizeMock.mockReturnValue({ width: 800, height: 600 });

    const hast = await markdownToHast('![alt](images/foo.png)');

    const img = findElement(hast, 'img');
    expect(img?.properties?.src).toBe(`/blog-assets/${SLUG}/images/foo.png`);
    expect(img?.properties?.width).toBe(800);
    expect(img?.properties?.height).toBe(600);
  });

  it('外部URL画像はローカルファイル判定をスキップし、width/heightを付与しない', async () => {
    const hast = await markdownToHast('![alt](https://example.com/foo.png)');

    expect(existsSyncMock).not.toHaveBeenCalled();
    const img = findElement(hast, 'img');
    expect(img?.properties?.src).toBe('https://example.com/foo.png');
    expect(img?.properties?.width).toBeUndefined();
    expect(img?.properties?.height).toBeUndefined();
  });

  it('実ファイルが存在しない場合はURLだけ解決し、width/heightを付与しない', async () => {
    existsSyncMock.mockReturnValue(false);

    const hast = await markdownToHast('![alt](images/missing.png)');

    expect(readFileSyncMock).not.toHaveBeenCalled();
    const img = findElement(hast, 'img');
    expect(img?.properties?.src).toBe(`/blog-assets/${SLUG}/images/missing.png`);
    expect(img?.properties?.width).toBeUndefined();
    expect(img?.properties?.height).toBeUndefined();
  });

  it('サイズ読み取りに失敗した場合もクラッシュせず、width/heightを付与しない', async () => {
    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(new Uint8Array());
    imageSizeMock.mockImplementation(() => {
      throw new Error('invalid image');
    });

    const hast = await markdownToHast('![alt](images/broken.png)');

    const img = findElement(hast, 'img');
    expect(img?.properties?.src).toBe(`/blog-assets/${SLUG}/images/broken.png`);
    expect(img?.properties?.width).toBeUndefined();
    expect(img?.properties?.height).toBeUndefined();
  });
});
