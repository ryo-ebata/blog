'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { Children, isValidElement } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface MdxTableProps extends ComponentPropsWithoutRef<'table'> {}

export function MdxTable({ className, children, ...props }: MdxTableProps) {
  // <br>タグをフィルタリング（HTMLの仕様上、<table>の直接の子に<br>は許可されていない）
  const filteredChildren = Children.toArray(children).filter((child) => {
    if (isValidElement(child)) {
      return child.type !== 'br';
    }
    return true;
  });

  return (
    <Table className={className} {...props}>
      {filteredChildren}
    </Table>
  );
}

export interface MdxTableHeaderProps extends ComponentPropsWithoutRef<'thead'> {}

export function MdxTableHeader({ className, ...props }: MdxTableHeaderProps) {
  return <TableHeader className={className} {...props} />;
}

export interface MdxTableBodyProps extends ComponentPropsWithoutRef<'tbody'> {}

export function MdxTableBody({ className, ...props }: MdxTableBodyProps) {
  return <TableBody className={className} {...props} />;
}

export interface MdxTableFooterProps extends ComponentPropsWithoutRef<'tfoot'> {}

export function MdxTableFooter({ className, ...props }: MdxTableFooterProps) {
  return <TableFooter className={className} {...props} />;
}

export interface MdxTableRowProps extends ComponentPropsWithoutRef<'tr'> {}

export function MdxTableRow({ className, ...props }: MdxTableRowProps) {
  return <TableRow className={className} {...props} />;
}

export interface MdxTableHeadProps extends ComponentPropsWithoutRef<'th'> {}

/**
 * ヘッダー行のセルを太字にする
 */
export function MdxTableHead({ className, ...props }: MdxTableHeadProps) {
  return (
    <TableHead
      className={cn('font-bold text-terminal-green dark:text-terminal-green', className)}
      {...props}
    />
  );
}

export interface MdxTableCellProps extends ComponentPropsWithoutRef<'td'> {}

export function MdxTableCell({ className, ...props }: MdxTableCellProps) {
  return <TableCell className={className} {...props} />;
}

export interface MdxTableCaptionProps extends ComponentPropsWithoutRef<'caption'> {}

export function MdxTableCaption({ className, ...props }: MdxTableCaptionProps) {
  return <TableCaption className={className} {...props} />;
}
