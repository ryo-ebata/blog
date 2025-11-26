import { MdxHeading, type MdxHeadingProps } from '@/components/mdx/heading/heading';
import { MdxLink, type MdxLinkProps } from '@/components/mdx/link/link';
import {
  MdxList,
  MdxListOrdered,
  type MdxListOrderedProps,
  type MdxListProps,
} from '@/components/mdx/list/list';
import { MdxParagraph, type MdxParagraphProps } from '@/components/mdx/paragragh/paragragh';

export const mdxComponents = {
  h1: (props: MdxHeadingProps) => <MdxHeading as="h1" {...props} />,
  h2: (props: MdxHeadingProps) => <MdxHeading as="h2" {...props} />,
  h3: (props: MdxHeadingProps) => <MdxHeading as="h3" {...props} />,
  h4: (props: MdxHeadingProps) => <MdxHeading as="h4" {...props} />,
  h5: (props: MdxHeadingProps) => <MdxHeading as="h5" {...props} />,
  h6: (props: MdxHeadingProps) => <MdxHeading as="h6" {...props} />,
  p: (props: MdxParagraphProps) => <MdxParagraph {...props} />,
  a: (props: MdxLinkProps) => <MdxLink {...props} />,
  ul: (props: MdxListProps) => <MdxList {...props} />,
  ol: (props: MdxListOrderedProps) => <MdxListOrdered {...props} />,
};
