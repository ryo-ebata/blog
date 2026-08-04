import { Container } from '@/components/organisms';
import { cn } from '@/lib/utils';

const CARD_COUNT = 6;

const CardSkeleton = () => (
  <div className={cn('overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10')}>
    <div className="aspect-[16/9] animate-pulse bg-muted" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-3 w-full animate-pulse rounded bg-muted" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
    </div>
  </div>
);

/* app/blog/page.tsxのSuspense fallback。/blogがInstant Navigationsの
   App Shellとしてプリロードされる際に表示される読み込み中の見た目を
   PostList/ArticleCardのレイアウトに合わせて再現している。 */
export const BlogListSkeleton = () => (
  <Container maxWidth="4xl">
    <div className="space-y-12">
      <div className="mb-12 space-y-4 text-center">
        <div className="mx-auto h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-6 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-8 w-20 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  </Container>
);
