'use client';

interface BlogTitleProps {
  title?: string;
}

const DEFAULT_TITLE = 'ブログ';

export const BlogTitle = ({ title = DEFAULT_TITLE }: BlogTitleProps) => (
  <h1 className="mb-8 text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
);
