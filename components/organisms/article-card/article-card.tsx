'use client';

import { type LucideIcon, icons } from 'lucide-react';
import { TagList } from '@/components/molecules/tag-list';
import { Time } from '@/components/atoms/time/time';
import Image from 'next/image';
import Link from 'next/link';

const ICON_SIZE = 36;
const ICON_CONTAINER_CLASS_WIDTH = 6;
const ICON_CONTAINER_CLASS_HEIGHT = 6;
const EMPTY_TAGS_LENGTH = 0;

export type ArticleCardIconType =
  | { emoji: string; type: 'emoji' }
  | { alt: string; src: string; type: 'image' }
  | { name: string; type: 'icon' };

export interface ArticleCardProps {
  date: string;
  description?: string;
  href: string;
  icon?: ArticleCardIconType;
  isExternal?: boolean;
  priority?: boolean;
  tags?: string[];
  title: string;
}

const getIconComponent = (iconName: string): LucideIcon | null => {
  const Icon = icons[iconName as keyof typeof icons];
  if (Icon) {
    return Icon;
  }
  return null;
};

const ArticleIcon = ({
  icon,
  priority = false,
}: {
  icon: ArticleCardIconType;
  priority?: boolean;
}) => {
  const renderIconContent = () => {
    if (icon.type === 'icon') {
      const IconComponent = getIconComponent(icon.name);
      if (!IconComponent) {
        return null;
      }
      return (
        <IconComponent
          className={`w-${ICON_CONTAINER_CLASS_WIDTH} h-${ICON_CONTAINER_CLASS_HEIGHT} text-muted-foreground`}
        />
      );
    }
    if (icon.type === 'emoji') {
      return <span className="text-2xl">{icon.emoji}</span>;
    }
    if (icon.type === 'image') {
      return (
        <Image
          src={icon.src}
          alt={icon.alt}
          width={ICON_SIZE}
          height={ICON_SIZE}
          priority={priority}
        />
      );
    }
    return null;
  };

  return (
    <div className="shrink-0 mt-1">
      <div className="w-12 h-12 rounded-lg bg-muted border flex items-center justify-center">
        {renderIconContent()}
      </div>
    </div>
  );
};

interface ArticleTitleLinkProps {
  href: string;
  isExternal: boolean;
  title: string;
}

const getExternalLinkProps = (isExternal: boolean): { rel?: string; target?: string } => {
  if (isExternal) {
    return { rel: 'noopener noreferrer', target: '_blank' };
  }
  return {};
};

const ArticleTitleLink = ({ href, isExternal, title }: ArticleTitleLinkProps) => {
  const linkProps = getExternalLinkProps(isExternal);

  return (
    <Link href={href} className="group mb-2 block" {...linkProps}>
      <h2 className="font-bold text-foreground scroll-m-20 text-xl group-hover:text-primary transition-colors duration-200">
        {title}
      </h2>
    </Link>
  );
};

interface ArticleMetaProps {
  date: string;
  tags?: string[];
}

const ArticleMeta = ({ date, tags }: ArticleMetaProps) => (
  <div className="flex items-center gap-4 mt-2">
    {tags && tags.length > EMPTY_TAGS_LENGTH && <TagList tags={tags} />}
    <Time date={date} />
  </div>
);

interface ArticleDescriptionProps {
  description?: string;
}

const ArticleDescription = ({ description }: ArticleDescriptionProps) => {
  if (!description) {
    return null;
  }
  return <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-2">{description}</p>;
};

interface ArticleContentProps {
  date: string;
  description?: string;
  href: string;
  isExternal: boolean;
  tags?: string[];
  title: string;
}

const ArticleContent = ({
  date,
  description,
  href,
  isExternal,
  tags,
  title,
}: ArticleContentProps) => (
  <div className="flex-1">
    <ArticleTitleLink href={href} isExternal={isExternal} title={title} />
    <ArticleMeta date={date} tags={tags} />
    <ArticleDescription description={description} />
  </div>
);

export const ArticleCard = ({
  date,
  description,
  href,
  icon,
  isExternal = false,
  priority = false,
  tags,
  title,
}: ArticleCardProps) => (
  <article className="bg-card border rounded-lg p-6 transition-all duration-300 hover:shadow-md">
    <div className="flex items-start gap-4">
      {icon && <ArticleIcon icon={icon} priority={priority} />}
      <ArticleContent
        date={date}
        description={description}
        href={href}
        isExternal={isExternal}
        tags={tags}
        title={title}
      />
    </div>
  </article>
);
