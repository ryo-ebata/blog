import Link from 'next/link';
import { TagsIcon } from 'lucide-react';
import { badgeVariants } from '@/components/atoms/badge';

const EMPTY_LENGTH = 0;

interface TagListProps {
  tags: string[];
}

const Tag = ({ tag }: { tag: string }) => {
  /* タグ専用一覧ページ(SSG)へのリンク。内部リンク網を強化する */
  const tagUrl = `/blog/tag/${encodeURIComponent(tag)}`;

  return (
    <Link href={tagUrl} className={badgeVariants({ variant: 'secondary' })}>
      {tag}
    </Link>
  );
};

export const TagList = ({ tags }: TagListProps) => {
  if (!tags || tags.length === EMPTY_LENGTH) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TagsIcon className="size-4 text-muted-foreground" />
      {tags.map((tagItem) => (
        <Tag key={tagItem} tag={tagItem} />
      ))}
    </div>
  );
};
