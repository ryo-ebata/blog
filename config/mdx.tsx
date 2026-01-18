import * as runtime from 'react/jsx-runtime';
import type { EvaluateOptions } from '@mdx-js/mdx';
import { Suspense } from 'react';
import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { ContentLinkCard as ContentLinkCardAsync } from '@/components/organisms/content-link-card/content-link-card';
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

const mdxComponents = {
  ContentLinkCard,
};

export const mdxConfig: Readonly<EvaluateOptions> = {
  ...runtime,
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        keepBackground: true,
        theme: 'github-dark',
        transformers: [transformerNotationDiff(), transformerNotationHighlight()],
      },
    ],
  ],
  remarkPlugins: [remarkGfm, remarkLinkCard],
  useMDXComponents: () => mdxComponents,
};
