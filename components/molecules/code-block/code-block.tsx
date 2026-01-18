/* oxlint-disable jsx-props-no-spreading -- hast-util-to-jsx-runtimeの仕様上props spreadingが必須 */
import type { ComponentProps, JSX } from 'react';
import type { Element, Root } from 'hast';
import type { Highlighter, ShikiTransformer } from 'shiki';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';

import { defaultTransformers, getHighlighter } from '@/lib/shiki/highlighter';
import { parseMeta } from '@/lib/shiki/parse-meta';

import { CopyButton } from './copy-button';
import type { CodeBlockProps } from './types';

import './code-block.css';

const createHighlightTransformer = (highlightLines: number[]): ShikiTransformer => ({
  line(node: Element, line: number) {
    if (highlightLines.includes(line)) {
      this.addClassToHast(node, 'highlighted');
    }
  },
});

interface GenerateHastOptions {
  code: string;
  highlightLines: number[];
  highlighter: Highlighter;
  lang: string;
  meta: string | undefined;
}

const generateHast = ({ code, highlightLines, highlighter, lang, meta }: GenerateHastOptions) =>
  highlighter.codeToHast(code, {
    defaultColor: false,
    lang,
    meta: { __raw: meta },
    themes: { dark: 'github-dark', light: 'github-light' },
    transformers: [...defaultTransformers, createHighlightTransformer(highlightLines)],
  });

const PreComponent = ({
  showLineNumbers,
  ...props
}: ComponentProps<'pre'> & { showLineNumbers: boolean }) => (
  <pre data-line-numbers={showLineNumbers || undefined} {...props} className="p-4" />
);

const renderHast = (hast: Root, showLineNumbers: boolean): JSX.Element =>
  toJsxRuntime(hast, {
    Fragment,
    components: {
      pre: (props) => <PreComponent showLineNumbers={showLineNumbers} {...props} />,
    },
    jsx,
    jsxs,
  }) as JSX.Element;

export const CodeBlock = async ({
  children,
  className,
  lang = 'plaintext',
  meta,
}: CodeBlockProps) => {
  const highlighter = await getHighlighter();
  const { highlightLines, showLineNumbers, title } = parseMeta(meta);
  const code = children.trim();
  const hast = generateHast({ code, highlightLines, highlighter, lang, meta });
  const rendered = renderHast(hast, showLineNumbers);

  return (
    <div className={`code-block-wrapper not-prose ${className ?? ''}`}>
      {title && <div className="code-block-title">{title}</div>}
      <div className="code-block-content group relative">
        {rendered}
        <CopyButton code={code} />
      </div>
    </div>
  );
};
