import { MdxHeading, type MdxHeadingProps } from '@/components/mdx/heading/heading';
import { MdxLink, type MdxLinkProps } from '@/components/mdx/link/link';

export const mdxComponents = {
  h1: (props: MdxHeadingProps) => <MdxHeading as="h1" {...props} />,
  h2: (props: MdxHeadingProps) => <MdxHeading as="h2" {...props} />,
  h3: (props: MdxHeadingProps) => <MdxHeading as="h3" {...props} />,
  h4: (props: MdxHeadingProps) => <MdxHeading as="h4" {...props} />,
  h5: (props: MdxHeadingProps) => <MdxHeading as="h5" {...props} />,
  h6: (props: MdxHeadingProps) => <MdxHeading as="h6" {...props} />,
  a: (props: MdxLinkProps) => <MdxLink {...props} />,
};
