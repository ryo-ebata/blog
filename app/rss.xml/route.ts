import { siteConfig } from '@/config/site';
import { getAllPostsMetadata } from '@/lib/posts';

/**
 * 日付をRFC 822形式に変換
 */
function formatRFC822(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = days[date.getUTCDay()];
  const dayNum = String(date.getUTCDate()).padStart(2, '0');
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
}

/**
 * XMLエスケープ
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getAllPostsMetadata();
  const siteUrl = siteConfig.url;

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
 <title>${escapeXml(siteConfig.name)}</title>
 <description>${escapeXml(siteConfig.description)}</description>
 <link>${siteUrl}</link>
 <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
 <language>ja</language>
 <lastBuildDate>${formatRFC822(new Date())}</lastBuildDate>
 ${posts
   .map((post) => {
     const postUrl = `${siteUrl}/blog/${post.metadata.slug}`;
     const pubDate = formatRFC822(new Date(post.metadata.createdAt));
     const description = post.metadata.description ? escapeXml(post.metadata.description) : '';

     return `<item>
  <title>${escapeXml(post.metadata.title)}</title>
  <description>${description}</description>
  <link>${postUrl}</link>
  <guid isPermaLink="true">${postUrl}</guid>
  <pubDate>${pubDate}</pubDate>
</item>`;
   })
   .join('\n ')}
</channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
