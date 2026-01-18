import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import type { Element } from 'hast';
import { type Highlighter, type ShikiTransformer, createHighlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export const getHighlighter = (): Promise<Highlighter> => {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      langs: [
        'typescript',
        'javascript',
        'tsx',
        'jsx',
        'css',
        'html',
        'json',
        'markdown',
        'bash',
        'shell',
        'yaml',
        'sql',
        'python',
        'rust',
        'go',
        'diff',
        'plaintext',
      ],
      themes: ['github-light', 'github-dark'],
    });
  }
  return highlighterPromise;
};

/** 各行にdata-line属性を付与するtransformer */
const transformerAddDataLine = (): ShikiTransformer => ({
  line(node: Element) {
    node.properties = node.properties || {};
    node.properties['data-line'] = '';
  },
});

export const defaultTransformers = [
  transformerNotationDiff(),
  transformerNotationHighlight(),
  transformerAddDataLine(),
];
