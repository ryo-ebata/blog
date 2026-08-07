import { describe, expect, it } from 'vitest';
import type { Element, Root } from 'hast';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';
import { rehypeCodeBlock } from './rehype-code-block';

const markdownToHast = async (markdown: string): Promise<Root> => {
  const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeCodeBlock);
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

const getText = (element: Element): string => {
  const [child] = element.children;
  return child?.type === 'text' ? child.value : '';
};

describe('rehypeCodeBlock', () => {
  it('言語指定付きのfenced code blockがcode-block要素に変換される', async () => {
    const hast = await markdownToHast('```typescript\nconst x = 1;\n```\n');

    const codeBlock = findElement(hast, 'code-block');
    expect(codeBlock).toBeDefined();
    expect(codeBlock?.properties?.lang).toBe('typescript');
    expect(getText(codeBlock as Element)).toBe('const x = 1;\n');
    expect(findElement(hast, 'pre')).toBeUndefined();
  });

  it('言語指定なしのfenced code blockはplaintext扱いになる', async () => {
    const hast = await markdownToHast('```\nconst x = 1;\n```\n');

    const codeBlock = findElement(hast, 'code-block');
    expect(codeBlock?.properties?.lang).toBe('plaintext');
  });

  it('info string中のmeta文字列がpropertiesへ渡される', async () => {
    const hast = await markdownToHast('```ts title="app.ts" showLineNumbers\nconst x = 1;\n```\n');

    const codeBlock = findElement(hast, 'code-block');
    expect(codeBlock?.properties?.lang).toBe('ts');
    expect(codeBlock?.properties?.meta).toBe('title="app.ts" showLineNumbers');
  });

  it('meta文字列がない場合はpropertiesにmetaを含まない', async () => {
    const hast = await markdownToHast('```ts\nconst x = 1;\n```\n');

    const codeBlock = findElement(hast, 'code-block');
    expect(codeBlock?.properties?.meta).toBeUndefined();
  });

  it('コードブロック以外の要素は影響を受けない', async () => {
    const hast = await markdownToHast('# 見出し\n\n段落テキスト\n\n```ts\nconst x = 1;\n```\n');

    expect(findElement(hast, 'h1')).toBeDefined();
    expect(findElement(hast, 'p')).toBeDefined();
    expect(findElement(hast, 'code-block')).toBeDefined();
  });
});
