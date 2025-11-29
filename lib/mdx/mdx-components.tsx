import { MdxHeading, type MdxHeadingProps } from '@/components/mdx/heading/heading';
import { MdxLink, type MdxLinkProps } from '@/components/mdx/link/link';
import {
  MdxList,
  MdxListOrdered,
  type MdxListOrderedProps,
  type MdxListProps,
} from '@/components/mdx/list/list';
import { MdxParagraph, type MdxParagraphProps } from '@/components/mdx/paragragh/paragragh';
import {
  MdxTable,
  MdxTableBody,
  type MdxTableBodyProps,
  MdxTableCaption,
  type MdxTableCaptionProps,
  MdxTableCell,
  type MdxTableCellProps,
  MdxTableFooter,
  type MdxTableFooterProps,
  MdxTableHead,
  MdxTableHeader,
  type MdxTableHeaderProps,
  type MdxTableHeadProps,
  type MdxTableProps,
  MdxTableRow,
  type MdxTableRowProps,
} from '@/components/mdx/table/table';

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
  table: (props: MdxTableProps) => <MdxTable {...props} />,
  thead: (props: MdxTableHeaderProps) => <MdxTableHeader {...props} />,
  tbody: (props: MdxTableBodyProps) => <MdxTableBody {...props} />,
  tfoot: (props: MdxTableFooterProps) => <MdxTableFooter {...props} />,
  tr: (props: MdxTableRowProps) => <MdxTableRow {...props} />,
  th: (props: MdxTableHeadProps) => <MdxTableHead {...props} />,
  td: (props: MdxTableCellProps) => <MdxTableCell {...props} />,
  caption: (props: MdxTableCaptionProps) => <MdxTableCaption {...props} />,
};
