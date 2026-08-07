import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Root, Element } from 'hast';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import { visit } from 'unist-util-visit';
import { applyShikiHighlight } from './rehype-shiki';

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
                  children: [
                    {
                      type: 'text',
                      value: 'const x = 1;',
                    },
                  ],
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

const parseHtml = (html: string): Root =>
  unified().use(rehypeParse, { fragment: true }).parse(html);

const findElements = (tree: Root, tagName: string): Element[] => {
  const elements: Element[] = [];
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === tagName) {
      elements.push(node);
    }
  });
  return elements;
};

describe('applyShikiHighlight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pre > code パターンがShikiでハイライトされる', async () => {
    const html = '<pre><code class="language-typescript">const x = 1;</code></pre>';
    const tree = parseHtml(html);

    const result = await applyShikiHighlight(tree);

    const preElements = findElements(result, 'pre');
    expect(preElements).toHaveLength(1);
    expect(preElements[0].properties?.class).toContain('shiki');
  });

  it('言語指定なしのコードブロックも処理される', async () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    const tree = parseHtml(html);

    const result = await applyShikiHighlight(tree);

    const preElements = findElements(result, 'pre');
    expect(preElements).toHaveLength(1);
    expect(preElements[0].properties?.class).toContain('shiki');
  });

  it('pre > code でないpre要素は変換されない', async () => {
    const html = '<pre>plain text</pre>';
    const tree = parseHtml(html);

    const result = await applyShikiHighlight(tree);

    const preElements = findElements(result, 'pre');
    expect(preElements).toHaveLength(1);
    expect(preElements[0].properties?.class).toBeUndefined();
  });

  it('コードブロック以外の要素は影響を受けない', async () => {
    const html =
      '<p>テキスト</p><pre><code class="language-typescript">const x = 1;</code></pre><p>テキスト2</p>';
    const tree = parseHtml(html);

    const result = await applyShikiHighlight(tree);

    const paragraphs = findElements(result, 'p');
    expect(paragraphs).toHaveLength(2);
  });

  it('codeToHast に正しい引数が渡される', async () => {
    const { getHighlighter } = await import('@/lib/shiki/highlighter');
    const mockGetHighlighter = getHighlighter as unknown as () => Promise<{
      codeToHast: ReturnType<typeof vi.fn>;
    }>;
    const mockHighlighter = await mockGetHighlighter();

    const html = '<pre><code class="language-typescript">const x = 1;</code></pre>';
    const tree = parseHtml(html);

    await applyShikiHighlight(tree);

    expect(mockHighlighter.codeToHast).toHaveBeenCalledWith(
      'const x = 1;',
      expect.objectContaining({
        lang: 'typescript',
        themes: { dark: 'github-dark', light: 'github-light' },
        defaultColor: false,
      })
    );
  });
});
