'use client';
interface BlogTitleProps {
  title?: string;
};

export function BlogTitle({ title = 'ブログ' }: BlogTitleProps) {
  return <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">{title}</h1>;
}
