'use client';

import { TagList } from '@/components/molecules/tag-list';
import { Time } from '@/components/atoms/time/time';
import Image from 'next/image';
import Link from 'next/link';

const ICON_SIZE = 40;
const EMPTY_TAGS_LENGTH = 0;

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

const getExternalLinkProps = (isExternal: boolean): { rel?: string; target?: string } => {
  if (isExternal) {
    return { rel: 'noopener noreferrer', target: '_blank' };
  }
  return {};
};

const CardIcon = ({
  icon,
  priority = false,
}: {
  icon: ArticleCardIconType;
  priority?: boolean;
}) => {
  if (icon.type === 'emoji') {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted border flex items-center justify-center shrink-0">
        <span className="text-xl">{icon.emoji}</span>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-muted border flex items-center justify-center shrink-0 overflow-hidden">
      <Image
        src={icon.src}
        alt={icon.alt}
        width={ICON_SIZE}
        height={ICON_SIZE}
        priority={priority}
      />
    </div>
  );
};

const CardEyecatch = ({
  eyecatch,
  priority = false,
}: {
  eyecatch: { url: string; height?: number; width?: number };
  priority?: boolean;
}) => (
  <div className="hidden sm:flex shrink-0 items-center">
    <div className="w-[160px] h-[100px] rounded-lg overflow-hidden border border-border/50">
      <Image
        src={eyecatch.url}
        alt=""
        width={160}
        height={100}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        priority={priority}
      />
    </div>
  </div>
);

export const ArticleCard = ({
  date,
  description,
  eyecatch,
  href,
  icon,
  isExternal = false,
  priority = false,
  tags,
  title,
}: ArticleCardProps) => {
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

      <div className="relative z-10 flex items-start gap-4 p-5 sm:p-6">
        {icon && <CardIcon icon={icon} priority={priority} />}

        <div className="flex-1 min-w-0">
          <Link href={href} {...linkProps} className="block">
            <h2 className="font-bold text-lg text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {title}
            </h2>
          </Link>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4 flex-wrap">
            {tags && tags.length > EMPTY_TAGS_LENGTH && (
              <div className="relative z-20">
                <TagList tags={tags} />
              </div>
            )}
            <Time date={date} />
          </div>
        </div>

        {!icon && eyecatch?.url && <CardEyecatch eyecatch={eyecatch} priority={priority} />}
      </div>
    </article>
  );
};
