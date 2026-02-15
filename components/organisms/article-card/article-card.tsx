'use client';

import { TagList } from '@/components/molecules/tag-list';
import { Time } from '@/components/atoms/time/time';
import Image from 'next/image';
import Link from 'next/link';

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
  tags?: string[];
  title: string;
}

function getExternalLinkProps(isExternal: boolean): { rel?: string; target?: string } {
  if (isExternal) {
    return { rel: 'noopener noreferrer', target: '_blank' };
  }
  return {};
}

function GradientCover({ children }: { children: React.ReactNode }) {
  return (
    <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
      {children}
    </div>
  );
}

function CardCover({
  eyecatch,
  icon,
  priority = false,
}: Pick<ArticleCardProps, 'eyecatch' | 'icon' | 'priority'>) {
  if (eyecatch?.url) {
    return (
      <div className="aspect-[16/9] overflow-hidden">
        <Image
          src={eyecatch.url}
          alt=""
          width={640}
          height={360}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
      </div>
    );
  }

  if (icon) {
    return (
      <GradientCover>
        {icon.type === 'emoji' ? (
          <span className="text-5xl">{icon.emoji}</span>
        ) : (
          <Image
            src={icon.src}
            alt={icon.alt}
            width={ICON_SIZE}
            height={ICON_SIZE}
            priority={priority}
          />
        )}
      </GradientCover>
    );
  }

  return (
    <GradientCover>
      <Image
        src={DEFAULT_EYECATCH_PATH}
        alt=""
        width={80}
        height={80}
        className="opacity-30"
        priority={priority}
      />
    </GradientCover>
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

  return (
    <article className="article-card group">
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-hidden="true"
        tabIndex={-1}
        {...linkProps}
      />

      <div className="relative z-10">
        <CardCover eyecatch={eyecatch} icon={icon} priority={priority} />

        <div className="p-5">
          <Link href={href} {...linkProps} className="block">
            <h2 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
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
    </article>
  );
}
