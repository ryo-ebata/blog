import Link from 'next/link';
import { Container } from '@/components/organisms';
import type { BaseContentMetadata } from '@/lib/content';
import { Time } from '@/components/atoms/time/time';

interface SitemapPresenterProps {
  posts: BaseContentMetadata[];
}

const staticPages = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
] as const;

export const SitemapPresenter = ({ posts }: SitemapPresenterProps) => (
  <Container maxWidth="4xl">
    <div className="space-y-12">
      <div className="mb-12 text-center space-y-4">
        <h1 className="font-bold scroll-m-20 text-3xl text-foreground">サイトマップ</h1>
      </div>

      <section className="space-y-4">
        <h2 className="font-bold scroll-m-20 text-xl border-b pb-2 text-foreground">ページ</h2>
        <ul className="space-y-2">
          {staticPages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-bold scroll-m-20 text-xl border-b pb-2 text-foreground">記事</h2>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.slug} className="flex items-center gap-4">
              <Link
                href={`/blog/${post.slug}`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {post.title}
              </Link>
              <Time date={post.createdAt} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  </Container>
);
