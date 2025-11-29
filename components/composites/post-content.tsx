import type { ComponentType } from 'react';

interface PostContentProps {
  Content: ComponentType;
}

export function PostContent({ Content }: PostContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none terminal-card rounded-none p-6 font-mono prose-headings:text-terminal-green dark:prose-headings:text-terminal-green prose-headings:font-mono prose-p:text-gray-700 dark:prose-p:text-gray-500 prose-p:font-mono prose-a:text-terminal-cyan dark:prose-a:text-terminal-cyan prose-a:no-underline hover:prose-a:text-terminal-green hover:prose-a:underline prose-strong:text-terminal-green dark:prose-strong:text-terminal-green prose-code:text-terminal-orange dark:prose-code:text-terminal-orange prose-code:bg-terminal-border prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-pre:bg-terminal-border dark:prose-pre:bg-terminal-border prose-pre:text-terminal-green prose-pre:border prose-pre:border-terminal-border prose-pre:rounded-none !bg-[var(--terminal-bg)]">
      <Content />
    </div>
  );
}
