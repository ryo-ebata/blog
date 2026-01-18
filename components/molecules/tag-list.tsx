import Link from 'next/link';
import { TagsIcon } from 'lucide-react';

const EMPTY_LENGTH = 0;

interface TagListProps {
  tags: string[];
}

const Tag = ({ tag }: { tag: string }) => {
  /* Nuqsの形式に合わせて、tagsパラメータをカンマ区切りで設定 */
  const tagUrl = `/blog?tags=${encodeURIComponent(tag)}`;

  return (
    <Link
      href={tagUrl}
      className="text-xs bg-secondary border px-2 py-1 rounded-md text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
    >
      {tag}
    </Link>
  );
};

export const TagList = ({ tags }: TagListProps) => {
  if (!tags || tags.length === EMPTY_LENGTH) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <TagsIcon className="w-4 h-4 text-muted-foreground" />
      {tags.map((tagItem) => (
        <Tag key={tagItem} tag={tagItem} />
      ))}
    </div>
  );
};
