'use client';

import type { BaseContentMetadata } from '@/lib/content';
import { TagList } from '@/components/molecules/tag-list';
import { Separator } from '@/components/atoms/separator';
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
  <span className="flex items-center gap-1 text-sm text-muted-foreground">
    <Pen className="size-4" />
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
        className="w-full rounded-xl shadow-xs ring-1 ring-foreground/10"
        priority
      />
    </div>
  );
};

export const PostHeader = ({ metadata }: PostHeaderProps) => (
  <div className="mb-8 space-y-4 p-6">
    <h1 className="scroll-m-20 text-3xl font-bold text-foreground">{metadata.title}</h1>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {metadata.tags && <TagList tags={metadata.tags} />}
      <Time date={metadata.createdAt} />
      <CharacterCount count={metadata.characterCount} />
    </div>
    <PostEyecatch eyecatch={metadata.eyecatch} slug={metadata.slug} />
    {metadata.description && (
      <>
        <Separator />
        <h2 className="scroll-m-20 text-xl font-semibold text-foreground">概要</h2>
        <p className="text-sm leading-7 text-muted-foreground">{metadata.description}</p>
      </>
    )}
  </div>
);
