import { type ReactNode, Suspense } from 'react';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import type { Root } from 'hast';

import { cn } from '@/lib/utils';

import { MdxBlockquote } from '@/components/molecules/mdx-blockquote';
import { MdxH1, MdxH2, MdxH3, MdxH4, MdxH5, MdxH6 } from '@/components/molecules/mdx-heading';
import { MdxTable } from '@/components/molecules/mdx-table';
import { ContentLinkCard as ContentLinkCardAsync } from '@/components/organisms/content-link-card/content-link-card';
import { ProductLink } from '@/components/organisms/product-link/product-link';

import { applyShikiHighlight } from './rehype-shiki';
import { rehypeLinkCard } from './rehype-link-card';
import { createMarkdownToHastProcessor } from './markdown-pipeline';
import { applyContentCacheLife } from './cache-policy';
import { extractToc, type TocItem } from './extract-toc';

const ContentLinkCardLoading = ({ url }: { url: string }) => {
  const shortUrl = new URL(url).hostname;
  return (
    <div
      className={cn(
        'not-prose flex w-full animate-pulse items-center gap-3 overflow-hidden rounded-xl bg-card p-4 text-card-foreground shadow-xs ring-1 ring-foreground/10'
      )}
    >
      <span>🔗</span>
      <div className="min-w-0 flex-1">
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
  table: MdxTable,
};

export interface RenderedMarkdownContent {
  content: ReactNode;
  toc: TocItem[];
}

/**
 * MarkdownをReact要素とTOCへ1回のパースで変換する。
 * TOCはShikiハイライト前のhast(見出し要素がそのまま残る段階)から抽出するため、
 * 別途Markdownを再パースする必要がない。
 */
export const renderMarkdownContent = async (
  markdown: string,
  slug: string
): Promise<RenderedMarkdownContent> => {
  'use cache';
  applyContentCacheLife();

  const processor = createMarkdownToHastProcessor(slug).use(rehypeLinkCard);

  const mdast = processor.parse(markdown);
  const hast = (await processor.run(mdast)) as Root;

  const toc = extractToc(hast);
  const highlighted = await applyShikiHighlight(hast);

  const content = toJsxRuntime(highlighted, {
    Fragment,
    jsx,
    jsxs,
    components,
  });

  return { content, toc };
};
