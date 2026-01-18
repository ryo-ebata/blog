import { type ReactElement, type ReactNode, Suspense } from 'react';
import * as runtime from 'react/jsx-runtime';
import type { EvaluateOptions } from '@mdx-js/mdx';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from '@/components/molecules/code-block';
import { MdxBlockquote } from '@/components/molecules/mdx-blockquote';
import { MdxH1, MdxH2, MdxH3, MdxH4, MdxH5, MdxH6 } from '@/components/molecules/mdx-heading';
import { ContentLinkCard as ContentLinkCardAsync } from '@/components/organisms/content-link-card/content-link-card';
import { rehypeCodeMeta } from '@/lib/mdx/rehype-code-meta';
import { remarkLinkCard } from '@/lib/mdx/remark-link-card';

const ContentLinkCardLoading = ({ url }: { url: string }) => {
  const shortUrl = new URL(url).hostname;
  return (
    <div className="not-prose flex w-full items-center gap-3 rounded-lg border bg-card p-4 animate-pulse">
      <span>🔗</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{shortUrl}</p>
        <p className="text-xs text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  );
};

const ContentLinkCard = ({ url }: { url: string }) => (
  <Suspense fallback={<ContentLinkCardLoading url={url} />}>
    <ContentLinkCardAsync url={url} />
  </Suspense>
);

interface CodeElementProps {
  children?: ReactNode;
  className?: string;
}

interface PreProps {
  children?: ReactElement<CodeElementProps>;
  'data-meta'?: string;
}

const Pre = (props: PreProps) => {
  const codeElement = props.children;
  if (!codeElement || typeof codeElement !== 'object') {
    return <pre>{props.children}</pre>;
  }

  const className = codeElement.props?.className ?? '';
  const lang = className.replace('language-', '') || undefined;
  const code = String(codeElement.props?.children ?? '');
  const meta = props['data-meta'];

  return (
    <CodeBlock lang={lang} meta={meta}>
      {code}
    </CodeBlock>
  );
};

const mdxComponents = {
  ContentLinkCard,
  blockquote: MdxBlockquote,
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxH4,
  h5: MdxH5,
  h6: MdxH6,
  pre: Pre,
};

export const mdxConfig: Readonly<EvaluateOptions> = {
  ...runtime,
  rehypePlugins: [rehypeSlug, rehypeCodeMeta],
  remarkPlugins: [remarkGfm, remarkLinkCard],
  useMDXComponents: () => mdxComponents,
};
