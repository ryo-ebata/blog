import Image from 'next/image';
import { cn } from '@/lib/utils';

/* 24時間キャッシュ */
const CACHE_REVALIDATE_SECONDS = 86400;
const REGEX_FLAGS_CASE_INSENSITIVE = 'i';
const MATCH_GROUP_INDEX = 1;

interface ContentLinkCardProps {
  className?: string;
  url: string;
}

const extractMetaContent = (html: string, property: string): string | undefined => {
  const pattern = new RegExp(
    `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    REGEX_FLAGS_CASE_INSENSITIVE
  );
  const match = html.match(pattern);

  if (match) {
    return match[MATCH_GROUP_INDEX];
  }

  /*
   * Content属性が先に来るパターンにも対応
   */
  const altPattern = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["'][^>]*>`,
    REGEX_FLAGS_CASE_INSENSITIVE
  );
  const altMatch = html.match(altPattern);

  if (altMatch) {
    return altMatch[MATCH_GROUP_INDEX];
  }
  return undefined;
};

const FallbackCard = ({ url }: { url: string }) => {
  const shortUrl = new URL(url).hostname;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group flex w-full items-center gap-3 rounded-lg border bg-card p-4 hover:border-primary transition-colors duration-200"
    >
      <span>🔗</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{shortUrl}</p>
        <p className="text-xs text-muted-foreground truncate">{url}</p>
      </div>
    </a>
  );
};

const extractTitle = (html: string): string | undefined => {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[MATCH_GROUP_INDEX]) {
    return titleMatch[MATCH_GROUP_INDEX].trim();
  }
  return undefined;
};

const extractImage = (html: string): string | undefined => {
  const ogImage = extractMetaContent(html, 'og:image');
  if (ogImage) {
    return ogImage;
  }
  const twitterImage = extractMetaContent(html, 'twitter:image');
  if (twitterImage) {
    return twitterImage;
  }
  return undefined;
};

const extractDescription = (html: string): string | undefined => {
  const ogDescription = extractMetaContent(html, 'og:description');
  if (ogDescription) {
    return ogDescription;
  }
  const metaDescription = extractMetaContent(html, 'description');
  if (metaDescription) {
    return metaDescription;
  }
  const twitterDescription = extractMetaContent(html, 'twitter:description');
  if (twitterDescription) {
    return twitterDescription;
  }
  return undefined;
};

interface LinkCardContentProps {
  className?: string;
  description?: string;
  image?: string;
  shortUrl: string;
  title: string;
  url: string;
}

const LinkCardContent = ({
  className,
  description,
  image,
  shortUrl,
  title,
  url,
}: LinkCardContentProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      'not-prose group flex w-full flex-col-reverse overflow-hidden rounded-lg border',
      'bg-card hover:border-primary transition-colors duration-200',
      'md:flex-row',
      className
    )}
  >
    <div className="flex flex-1 flex-col justify-between gap-2 p-4">
      <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </p>
      {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
      <p className="text-xs text-muted-foreground">{shortUrl}</p>
    </div>
    {image && (
      <div className="relative h-32 w-full shrink-0 overflow-hidden md:h-auto md:w-48">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 192px, 100vw"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          unoptimized
        />
      </div>
    )}
  </a>
);

export const ContentLinkCard = async ({ className, url }: ContentLinkCardProps) => {
  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return <FallbackCard url={url} />;
    }

    const html = await response.text();
    const title = extractTitle(html);

    if (!title) {
      return <FallbackCard url={url} />;
    }

    const image = extractImage(html);
    const description = extractDescription(html);
    const shortUrl = new URL(url).hostname;

    return (
      <LinkCardContent
        className={className}
        description={description}
        image={image}
        shortUrl={shortUrl}
        title={title}
        url={url}
      />
    );
  } catch {
    return <FallbackCard url={url} />;
  }
};
