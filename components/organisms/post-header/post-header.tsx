'use client';

import type { NoteMetadata } from '@/lib/notes';
import type { PostMetadata } from '@/lib/posts';
import { TagList } from '@/components/molecules/tag-list';
import { Time } from '@/components/atoms/time/time';
import { Pen } from 'lucide-react';

interface PostHeaderProps {
  metadata: NoteMetadata | PostMetadata;
}

const CharacterCount = ({ count }: { count?: number }) => (
  <span className="text-muted-foreground flex items-center">
    <Pen className="w-4 h-4 mr-1" />
    {count} 文字
  </span>
);

export const PostHeader = ({ metadata }: PostHeaderProps) => (
  <div className="mb-8 space-y-4 p-6 border-b">
    <h1 className="font-bold scroll-m-20 text-3xl text-foreground">{metadata.title}</h1>
    <div className="flex items-center gap-4">
      {metadata.tags && <TagList tags={metadata.tags} />}
      <Time date={metadata.createdAt} />
      <CharacterCount count={metadata.characterCount} />
    </div>
    {metadata.description && (
      <>
        <h2 className="font-bold scroll-m-20 text-xl border-b pb-2 text-foreground">概要</h2>
        <p className="leading-7 text-muted-foreground">{metadata.description}</p>
      </>
    )}
  </div>
);
