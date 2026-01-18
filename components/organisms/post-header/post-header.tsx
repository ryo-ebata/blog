'use client';

import { Pen } from 'lucide-react';
import { Time } from '@/components/atoms/time/time';
import { TagList } from '@/components/molecules/tag-list';
import type { NoteMetadata } from '@/lib/notes';
import type { PostMetadata } from '@/lib/posts';

interface PostHeaderProps {
  metadata: PostMetadata | NoteMetadata;
}

export function PostHeader({ metadata }: PostHeaderProps) {
  return (
    <div className="mb-8 space-y-4 p-6 border-b">
      <h1 className="font-bold scroll-m-20 text-3xl text-foreground">{metadata.title}</h1>
      <div className="flex items-center gap-4">
        {metadata.tags && <TagList tags={metadata.tags} />}
        <Time date={metadata.createdAt} />
        <span className="text-muted-foreground flex items-center">
          <Pen className="w-4 h-4 mr-1" />
          {metadata.characterCount} 文字
        </span>
      </div>
      {metadata.description && (
        <>
          <h2 className="font-bold scroll-m-20 text-xl border-b pb-2 text-foreground">概要</h2>
          <p className="leading-7 text-muted-foreground">{metadata.description}</p>
        </>
      )}
    </div>
  );
}
