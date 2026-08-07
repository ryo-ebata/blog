import type { Root, Element, Text } from 'hast';
import { visit } from 'unist-util-visit';
import { getHighlighter, defaultTransformers } from '@/lib/shiki/highlighter';

const extractLanguage = (codeElement: Element): string => {
  const classNames = codeElement.properties?.className;
  if (!Array.isArray(classNames)) {
    return 'plaintext';
  }

  for (const className of classNames) {
    if (typeof className === 'string' && className.startsWith('language-')) {
      return className.replace('language-', '');
    }
  }

  return 'plaintext';
};

const getTextContent = (node: Element): string => {
  const texts: string[] = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      texts.push((child as Text).value);
    }
    if (child.type === 'element') {
      texts.push(getTextContent(child as Element));
    }
  }
  return texts.join('');
};

const isPreCodePattern = (node: Element): { code: string; lang: string } | null => {
  if (node.tagName !== 'pre') {
    return null;
  }

  const codeChild = node.children.find(
    (child): child is Element => child.type === 'element' && (child as Element).tagName === 'code'
  );

  if (!codeChild) {
    return null;
  }

  const lang = extractLanguage(codeChild);
  const code = getTextContent(codeChild);

  return { code, lang };
};

export const applyShikiHighlight = async (tree: Root): Promise<Root> => {
  const highlighter = await getHighlighter();

  const replacements: Array<{
    index: number;
    parent: Root | Element;
    newNode: Element;
  }> = [];

  visit(tree, 'element', (node: Element, index, parent) => {
    if (index === undefined || parent === undefined) {
      return;
    }

    const result = isPreCodePattern(node);
    if (!result) {
      return;
    }

    const hast = highlighter.codeToHast(result.code, {
      lang: result.lang,
      themes: { dark: 'github-dark', light: 'github-light' },
      defaultColor: false,
      transformers: [...defaultTransformers],
    });

    const preElement = hast.children[0] as Element;
    replacements.push({ index, parent: parent as Root | Element, newNode: preElement });
  });

  for (const { index, parent, newNode } of replacements) {
    parent.children[index] = newNode;
  }

  return tree;
};
