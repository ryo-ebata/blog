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
      <TagsIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
}

function Tag({ tag }: { tag: string }) {
  return (
    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-1 rounded text-gray-700 dark:text-gray-300 font-medium">
      {tag}
    </span>
  );
}
