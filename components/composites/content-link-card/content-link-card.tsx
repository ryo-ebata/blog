import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ContentLinkCardProps {
  url: string;
  className?: string;
}

function extractMetaContent(html: string, property: string): string | undefined {
  const pattern = new RegExp(
    `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    'i'
  );
  const match = html.match(pattern);

  if (match) {
    return match[1];
  }

  // content属性が先に来るパターンにも対応
  const altPattern = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["'][^>]*>`,
    'i'
  );
  const altMatch = html.match(altPattern);

  return altMatch?.[1];
}

export async function ContentLinkCard({ url, className }: ContentLinkCardProps) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // 24時間キャッシュ
    });

    if (!response.ok) {
      return <FallbackCard url={url} />;
    }

    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim();

    const image = extractMetaContent(html, 'og:image') ?? extractMetaContent(html, 'twitter:image');

    const description =
      extractMetaContent(html, 'og:description') ??
      extractMetaContent(html, 'description') ??
      extractMetaContent(html, 'twitter:description');

    const shortUrl = new URL(url).hostname;

    if (!title) {
      return <FallbackCard url={url} />;
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'not-prose group flex w-full flex-col-reverse overflow-hidden rounded-lg border border-terminal-border',
          'bg-terminal-bg hover:border-terminal-green transition-colors duration-200',
          'md:flex-row',
          className
        )}
      >
        <div className="flex flex-1 flex-col justify-between gap-2 p-4">
          <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-terminal-green transition-colors">
            {title}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
          <p className="text-xs font-mono text-terminal-cyan">{shortUrl}</p>
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
  } catch {
    return <FallbackCard url={url} />;
  }
}

function FallbackCard({ url }: { url: string }) {
  const shortUrl = new URL(url).hostname;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group flex w-full items-center gap-3 rounded-lg border border-terminal-border bg-terminal-bg p-4 hover:border-terminal-green transition-colors duration-200"
    >
      <span className="text-terminal-cyan">🔗</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono text-terminal-cyan truncate">{shortUrl}</p>
        <p className="text-xs text-muted-foreground truncate">{url}</p>
      </div>
    </a>
  );
}
