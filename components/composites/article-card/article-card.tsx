'use client';

import { icons, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TagList } from '@/components/composites/tag-list';
import { Time } from '@/components/elements/time/time';

export type ArticleCardIconType =
  | { type: 'icon'; name: string }
  | { type: 'emoji'; emoji: string }
  | { type: 'image'; src: string; alt: string };

export interface ArticleCardProps {
  title: string;
  href: string;
  date: string;
  tags?: string[];
  description?: string;
  icon?: ArticleCardIconType;
  isExternal?: boolean;
  priority?: boolean;
}

function getIconComponent(iconName: string): LucideIcon | null {
  const Icon = icons[iconName as keyof typeof icons];
  return Icon || null;
}

function ArticleIcon({
  icon,
  priority = false,
}: {
  icon: ArticleCardIconType;
  priority?: boolean;
}) {
  return (
    <div className="shrink-0 mt-1">
      <div className="w-12 h-12 rounded-lg bg-muted border flex items-center justify-center">
        {icon.type === 'icon' &&
          (() => {
            const IconComponent = getIconComponent(icon.name);
            if (!IconComponent) return null;
            return <IconComponent className="w-6 h-6 text-muted-foreground" />;
          })()}
        {icon.type === 'emoji' && <span className="text-2xl">{icon.emoji}</span>}
        {icon.type === 'image' && (
          <Image src={icon.src} alt={icon.alt} width={36} height={36} priority={priority} />
        )}
      </div>
    </div>
  );
}

export function ArticleCard({
  title,
  href,
  date,
  tags,
  description,
  icon,
  isExternal = false,
  priority = false,
}: ArticleCardProps) {
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <article className="bg-card border rounded-lg p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        {icon && <ArticleIcon icon={icon} priority={priority} />}
        <div className="flex-1">
          <Link href={href} className="group mb-2 block" {...linkProps}>
            <h2 className="font-bold text-foreground scroll-m-20 text-xl group-hover:text-primary transition-colors duration-200">
              {title}
            </h2>
          </Link>
          <div className="flex items-center gap-4 mt-2">
            {tags && tags.length > 0 && <TagList tags={tags} />}
            <Time date={date} />
          </div>

          {description && (
            <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </article>
  );
}
