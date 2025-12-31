'use client';

import { Pen } from 'lucide-react';
import { TagList } from '@/components/composites/tag-list';
import type { PostMetadata } from '@/lib/posts';
import { Time } from '../time/time';

interface PostHeaderProps {
  metadata: PostMetadata;
}

export function PostHeader({ metadata }: PostHeaderProps) {
  return (
    <div className="mb-8 space-y-4 p-6 font-mono border-b-2 border-terminal-border">
      <h1 className="font-bold font-mono text-terminal-green terminal-glow scroll-m-20 text-3xl">
        {metadata.title}
      </h1>
      <div className="flex items-center gap-4">
        {metadata.tags && <TagList tags={metadata.tags} />}
        <Time date={metadata.createdAt} />
        <span className="text-gray-600 dark:text-gray-300 flex items-center">
          <Pen className="w-4 h-4 mr-1" />
          {metadata.characterCount} characters
        </span>
      </div>
      <h2 className="font-bold font-mono text-terminal-green terminal-glow scroll-m-20 text-2xl border-b-2 border-dashed border-terminal-border pb-2">
        TL;DR:
      </h2>
      <p className="leading-7 text-gray-600 dark:text-gray-300">{metadata.description}</p>
    </div>
  );
}
