'use client';

import { cn } from "@/lib/utils";

export interface MdxListProps {
  children: React.ReactNode;
}

export interface MdxListItemProps {
  children: React.ReactNode;
}

export interface MdxListOrderedProps {
  children: React.ReactNode;
}

const commonClassName = 'text-md text-gray-700 dark:text-gray-300';

export function MdxList({ children }: MdxListProps) {
  return <ul className={cn(commonClassName, 'list-disc list-inside')}>{children}</ul>;
}

export function MdxListItem({ children }: MdxListItemProps) {
  return <li className={cn(commonClassName, 'ml-4')}>{children}</li>;
}

export function MdxListOrdered({ children }: MdxListOrderedProps) {
  return <ol className={cn(commonClassName, 'list-decimal list-inside')}>{children}</ol>;
}
