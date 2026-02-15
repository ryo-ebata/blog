'use client';

import { TagList } from '@/components/molecules/tag-list';
import { Time } from '@/components/atoms/time/time';
import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, type SyntheticEvent, useState } from 'react';

const ICON_SIZE = 48;
const DEFAULT_EYECATCH_PATH = '/image/default-eyecatch.svg';
const SAMPLE_SIZE = 4;

export type ArticleCardIconType =
  | { emoji: string; type: 'emoji' }
  | { alt: string; src: string; type: 'image' };

export interface ArticleCardProps {
  date: string;
  description?: string;
  eyecatch?: { url: string; height?: number; width?: number };
  href: string;
  icon?: ArticleCardIconType;
  isExternal?: boolean;
  priority?: boolean;
  tags?: string[];
  title: string;
}

type BlurLuminance = 'light' | 'dark';

/** 画像の下半分の平均輝度を計算し、明暗を判定する */
function calculateLuminance(img: HTMLImageElement): BlurLuminance {
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'dark';
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const { data } = ctx.getImageData(0, SAMPLE_SIZE / 2, SAMPLE_SIZE, SAMPLE_SIZE / 2);
  let totalLuminance = 0;
  const pixelCount = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    totalLuminance += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return totalLuminance / pixelCount / 255 > 0.5 ? 'light' : 'dark';
}

function getExternalLinkProps(isExternal: boolean): { rel?: string; target?: string } {
  if (isExternal) {
    return { rel: 'noopener noreferrer', target: '_blank' };
  }
  return {};
}

function CardBackground({
  eyecatch,
  onLoad,
  priority = false,
}: Pick<ArticleCardProps, 'eyecatch' | 'priority'> & {
  onLoad?: (e: SyntheticEvent<HTMLImageElement>) => void;
}) {
  if (eyecatch?.url) {
    return (
      <Image
        src={eyecatch.url}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority={priority}
        onLoad={onLoad}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted transition-transform duration-500 group-hover:scale-105" />
  );
}

function CardIcon({ icon, priority = false }: { icon: ArticleCardIconType; priority?: boolean }) {
  if (icon.type === 'emoji') {
    return <span className="text-5xl">{icon.emoji}</span>;
  }

  return (
    <Image src={icon.src} alt={icon.alt} width={ICON_SIZE} height={ICON_SIZE} priority={priority} />
  );
}

export function ArticleCard({
  date,
  description,
  eyecatch,
  href,
  icon,
  isExternal = false,
  priority = false,
  tags,
  title,
}: ArticleCardProps) {
  const linkProps = getExternalLinkProps(isExternal);
  const showDefaultIcon = !eyecatch?.url && !icon;
  const [blurLuminance, setBlurLuminance] = useState<BlurLuminance | null>(null);

  const handleEyecatchLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    try {
      setBlurLuminance(calculateLuminance(event.currentTarget));
    } catch {
      // tainted canvas - fall back to default theme colors
    }
  };

  const blurStyle: CSSProperties | undefined = blurLuminance
    ? ({
        '--blur-heading': blurLuminance === 'light' ? 'oklch(0.2 0 0)' : 'oklch(0.95 0 0)',
        '--blur-text': blurLuminance === 'light' ? 'oklch(0.35 0 0)' : 'oklch(0.8 0 0)',
      } as CSSProperties)
    : undefined;

  return (
    <article className="article-card group" style={blurStyle}>
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-hidden="true"
        tabIndex={-1}
        {...linkProps}
      />

      <div className="relative z-10 flex flex-col">
        <div className="relative aspect-[16/9] overflow-hidden">
          <CardBackground eyecatch={eyecatch} priority={priority} onLoad={handleEyecatchLoad} />
          <div className="absolute inset-0 flex items-center justify-center">
            {icon && <CardIcon icon={icon} priority={priority} />}
            {showDefaultIcon && (
              <Image
                src={DEFAULT_EYECATCH_PATH}
                alt=""
                width={80}
                height={80}
                className="opacity-30"
                priority={priority}
              />
            )}
          </div>
        </div>

        <div className="article-card-body">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="article-card-blur" aria-hidden="true">
              <CardBackground eyecatch={eyecatch} priority={false} />
            </div>
          </div>
          <div className="p-5 relative z-10">
            <Link href={href} {...linkProps} className="block">
              <h2 className="font-bold text-base text-foreground leading-snug line-clamp-2">
                {title}
              </h2>
            </Link>

            {description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              {tags && tags.length > 0 && (
                <div className="relative z-20">
                  <TagList tags={tags} />
                </div>
              )}
              <Time date={date} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
