import { TagIcon } from "lucide-react";

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 mt-4 flex-wrap items-center">
      <TagIcon className="w-3.5 h-3.5 mr-1 text-gray-600 dark:text-gray-400" />
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300 font-medium"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
