import type { EvaluateOptions } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '@/lib/mdx/mdx-components';
import { rehypeBreaks } from '@/lib/mdx/rehype-breaks';
import { remarkLinkCard } from '@/lib/mdx/remark-link-card';

export const mdxConfig: Readonly<EvaluateOptions> = {
  ...runtime,
  useMDXComponents: () => mdxComponents,
  remarkPlugins: [remarkGfm, remarkLinkCard],
  rehypePlugins: [
    rehypeSlug,
    rehypeBreaks,
    [
      rehypePrettyCode,
      {
        theme: 'github-dark',
        keepBackground: false,
      },
    ],
  ],
};
