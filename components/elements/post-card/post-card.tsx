'use client';

import { icons, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { TagList } from '@/components/composites/tag-list';
import { MdxHeading } from '@/components/mdx/heading/heading';
import type { PostMetadata } from '@/lib/posts';
import { Time } from '../time/time';

interface PostCardProps {
  metadata: PostMetadata;
}

function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  const Icon = icons[iconName as keyof typeof icons];
  return Icon || null;
}

export function PostCard({ metadata }: PostCardProps) {
  const IconComponent = getIconComponent(metadata.icon);

  return (
    <article className="terminal-card p-6 transition-all duration-300 font-mono">
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className="shrink-0 mt-1">
            <div className="w-12 h-12 rounded-none bg-terminal-border dark:bg-terminal-border border border-terminal-green flex items-center justify-center terminal-glow">
              <IconComponent className="w-6 h-6 text-terminal-green dark:text-terminal-green" />
            </div>
          </div>
        )}
        <div className="flex-1">
          <Link href={`/blog/${metadata.slug}`} className="group">
            <MdxHeading
              as="h2"
              className="text-terminal-cyan dark:text-terminal-cyan group-hover:text-terminal-green transition-colors duration-200"
            >
              {metadata.title}
            </MdxHeading>
          </Link>
          <div className="flex items-center gap-4 mt-2">
            {metadata.tags && <TagList tags={metadata.tags} />}
            <Time date={metadata.createdAt} />
          </div>

          {metadata.description && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
              {metadata.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
