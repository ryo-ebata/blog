'use client';

import type { BaseContentMetadata } from '@/lib/content';
import { TagList } from '@/components/molecules/tag-list';
import { Time } from '@/components/atoms/time/time';
import { Pen } from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';

const DEFAULT_EYECATCH_PATH = '/image/default-eyecatch.svg';
const EYECATCH_WIDTH = 1200;
const EYECATCH_HEIGHT = 630;

interface PostHeaderProps {
  metadata: BaseContentMetadata;
}

const CharacterCount = ({ count }: { count?: number }) => (
  <span className="text-muted-foreground flex items-center">
    <Pen className="w-4 h-4 mr-1" />
    {count?.toLocaleString()} 文字
  </span>
);

const PostEyecatch = ({
  eyecatch,
  slug,
}: {
  eyecatch?: { url: string; height?: number; width?: number };
  slug: string;
}) => {
  const src = eyecatch?.url ?? DEFAULT_EYECATCH_PATH;
  const width = eyecatch?.width ?? EYECATCH_WIDTH;
  const height = eyecatch?.height ?? EYECATCH_HEIGHT;

  return (
    <div style={{ viewTransitionName: `eyecatch-${slug}` } as CSSProperties}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className="w-full rounded-lg"
        priority
      />
    </div>
  );
};

export const PostHeader = ({ metadata }: PostHeaderProps) => (
  <div className="mb-8 space-y-4 p-6 border-b">
    <h1 className="font-bold scroll-m-20 text-3xl text-foreground">{metadata.title}</h1>
    <div className="flex items-center gap-4">
      {metadata.tags && <TagList tags={metadata.tags} />}
      <Time date={metadata.createdAt} />
      <CharacterCount count={metadata.characterCount} />
    </div>
    <PostEyecatch eyecatch={metadata.eyecatch} slug={metadata.slug} />
    {metadata.description && (
      <>
        <h2 className="font-bold scroll-m-20 text-xl border-b pb-2 text-foreground">概要</h2>
        <p className="leading-7 text-muted-foreground">{metadata.description}</p>
      </>
    )}
  </div>
);
