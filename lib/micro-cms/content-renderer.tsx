import { type ReactNode, Suspense } from 'react';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSlug from 'rehype-slug';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import type { Root } from 'hast';

import { MdxBlockquote } from '@/components/molecules/mdx-blockquote';
import { MdxH1, MdxH2, MdxH3, MdxH4, MdxH5, MdxH6 } from '@/components/molecules/mdx-heading';
import { ContentLinkCard as ContentLinkCardAsync } from '@/components/organisms/content-link-card/content-link-card';
import { ProductLink } from '@/components/organisms/product-link/product-link';

import { applyShikiHighlight } from './rehype-shiki';
import { rehypeLinkCard } from './rehype-link-card';

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

const components = {
  'link-card': ContentLinkCard,
  'product-link': ProductLink,
  blockquote: MdxBlockquote,
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxH4,
  h5: MdxH5,
  h6: MdxH6,
};

export const renderMicroCMSContent = async (html: string): Promise<ReactNode> => {
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSlug)
    .use(rehypeLinkCard);

  const parsed = processor.parse(html);
  const hast = await processor.run(parsed);

  const highlighted = await applyShikiHighlight(hast as Root);

  return toJsxRuntime(highlighted, {
    Fragment,
    jsx,
    jsxs,
    components,
  });
};
