'use client';

import { TagList } from '@/components/molecules/tag-list';
import { Time } from '@/components/atoms/time/time';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import type { CSSProperties } from 'react';

const ICON_SIZE = 48;
const DEFAULT_EYECATCH_PATH = '/image/default-eyecatch.svg';

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
  slug?: string;
  tags?: string[];
  title: string;
}

function getExternalLinkProps(isExternal: boolean): { rel?: string; target?: string } {
  if (isExternal) {
    return { rel: 'noopener noreferrer', target: '_blank' };
  }
  return {};
}

function CardBackground({
  eyecatch,
  priority = false,
}: Pick<ArticleCardProps, 'eyecatch' | 'priority'>) {
  if (eyecatch?.url) {
    return (
      <Image
        src={eyecatch.url}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority={priority}
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
  slug,
  tags,
  title,
}: ArticleCardProps) {
  const linkProps = getExternalLinkProps(isExternal);
  const showDefaultIcon = !eyecatch?.url && !icon;

  return (
    <article className="article-card group">
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-hidden="true"
        tabIndex={-1}
        {...linkProps}
      />

      <div className="relative z-10 flex flex-col">
        <div
          className="relative aspect-[16/9] overflow-hidden"
          style={slug ? ({ viewTransitionName: `eyecatch-${slug}` } as CSSProperties) : undefined}
        >
          <CardBackground eyecatch={eyecatch} priority={priority} />
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
          <div className="relative z-10 flex flex-col gap-3 p-5">
            <Link href={href} {...linkProps} className="block">
              <h2 className="text-base font-semibold leading-snug text-card-foreground line-clamp-2 transition-colors group-hover:text-primary">
                {title}
              </h2>
            </Link>

            {description && (
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
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
