import { Container } from '@/components/organisms';
import { cn } from '@/lib/utils';

const CARD_COUNT = 4;

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

/* /blog/tag/[slug]のInstant Navigations App Shell。
   新ISR挙動(未知タグへの初回アクセス時に即座に表示される)の受け皿になる。 */
const TagPageLoading = () => (
  <Container maxWidth="4xl">
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  </Container>
);

export default TagPageLoading;
