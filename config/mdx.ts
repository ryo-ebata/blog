import type { EvaluateOptions } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const mdxConfig: Readonly<EvaluateOptions> = {
  ...runtime,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: 'github-dark',
        keepBackground: true,
      },
    ],
  ],
};
