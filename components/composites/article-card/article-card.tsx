'use client';

import { icons, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TagList } from '@/components/composites/tag-list';
import { Time } from '@/components/elements/time/time';

export type ArticleCardIconType =
  | { type: 'icon'; name: string; color?: 'green' | 'purple' | 'orange' }
  | { type: 'emoji'; emoji: string; color?: 'green' | 'purple' | 'orange' }
  | { type: 'image'; src: string; alt: string; color?: 'green' | 'purple' | 'orange' };

export interface ArticleCardProps {
  title: string;
  href: string;
  date: string;
  tags?: string[];
  description?: string;
  icon?: ArticleCardIconType;
  hoverColor?: 'green' | 'purple' | 'orange';
  isExternal?: boolean;
  priority?: boolean;
}

const colorClasses = {
  green: {
    border: 'border-terminal-green',
    text: 'text-terminal-green dark:text-terminal-green',
    hover: 'group-hover:text-terminal-green',
  },
  purple: {
    border: 'border-terminal-purple',
    text: 'text-terminal-purple dark:text-terminal-purple',
    hover: 'group-hover:text-terminal-purple',
  },
  orange: {
    border: 'border-terminal-orange',
    text: 'text-terminal-orange dark:text-terminal-orange',
    hover: 'group-hover:text-terminal-orange',
  },
} as const;

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
  const color = icon.color || 'green';
  const colorClass = colorClasses[color];

  return (
    <div className="shrink-0 mt-1">
      <div
        className={`w-12 h-12 rounded-none bg-terminal-border dark:bg-terminal-border border ${colorClass.border} flex items-center justify-center terminal-glow`}
      >
        {icon.type === 'icon' &&
          (() => {
            const IconComponent = getIconComponent(icon.name);
            if (!IconComponent) return null;
            return <IconComponent className={`w-6 h-6 ${colorClass.text}`} />;
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
  hoverColor = 'green',
  isExternal = false,
  priority = false,
}: ArticleCardProps) {
  const hoverColorClass = colorClasses[hoverColor];

  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <article className="terminal-card rounded-none p-6 transition-all duration-300 font-mono">
      <div className="flex items-start gap-4">
        {icon && <ArticleIcon icon={icon} priority={priority} />}
        <div className="flex-1">
          <Link href={href} className="group mb-2 block" {...linkProps}>
            <h2
              className={`font-bold font-mono text-terminal-cyan scroll-m-20 text-xl ${hoverColorClass.hover} transition-colors duration-200`}
            >
              {title}
            </h2>
          </Link>
          <div className="flex items-center gap-4 mt-2">
            {tags && tags.length > 0 && <TagList tags={tags} />}
            <Time date={date} />
          </div>

          {description && (
            <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
