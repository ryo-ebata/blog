'use client';

interface BlogTitleProps {
  title?: string;
}

const DEFAULT_TITLE = 'ブログ';

export const BlogTitle = ({ title = DEFAULT_TITLE }: BlogTitleProps) => (
  <h1 className="text-4xl font-bold mb-8 text-foreground">{title}</h1>
);
