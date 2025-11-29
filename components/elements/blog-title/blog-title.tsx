'use client';
interface BlogTitleProps {
  title?: string;
}

export function BlogTitle({ title = 'ブログ' }: BlogTitleProps) {
  return (
    <h1 className="text-4xl font-bold mb-8 font-mono text-terminal-green dark:text-terminal-green terminal-glow">
      {title}
    </h1>
  );
}
