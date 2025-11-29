import { TagsIcon } from 'lucide-react';

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <TagsIcon className="w-4 h-4 text-terminal-cyan dark:text-terminal-cyan" />
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
}

function Tag({ tag }: { tag: string }) {
  return (
    <span className="text-xs bg-terminal-border dark:bg-terminal-border border border-terminal-green px-1.5 py-1 rounded-none text-terminal-green dark:text-terminal-green font-mono font-medium">
      #{tag}
    </span>
  );
}
