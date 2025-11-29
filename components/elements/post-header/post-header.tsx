'use client';

import { TagList } from '@/components/composites/tag-list';
import { MdxHeading } from '@/components/mdx/heading/heading';
import { MdxParagraph } from '@/components/mdx/paragragh/paragragh';
import type { PostMetadata } from '@/lib/posts';
import { Time } from '../time/time';

interface PostHeaderProps {
  metadata: PostMetadata;
}

export function PostHeader({ metadata }: PostHeaderProps) {
  return (
    <div className="mb-8 space-y-4 p-6 font-mono border-b-2 border-terminal-border">
      <MdxHeading as="h1" className="text-terminal-green dark:text-terminal-green terminal-glow">
        {metadata.title}
      </MdxHeading>
      <div className="flex items-center gap-4">
        {metadata.tags && <TagList tags={metadata.tags} />}
        <Time date={metadata.createdAt} />
      </div>
      <MdxHeading as="h2" className="text-terminal-green dark:text-terminal-green terminal-glow">
        TL;DR:
      </MdxHeading>
      <MdxParagraph className="text-gray-600 dark:text-gray-300">
        {metadata.description}
      </MdxParagraph>
    </div>
  );
}
