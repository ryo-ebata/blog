import { Skeleton } from '@/components/atoms';
import { ArticleCardSkeleton, Container } from '@/components/organisms';

const CARD_COUNT = 4;

/* /blog/tag/[slug]のInstant Navigations App Shell。
   新ISR挙動(未知タグへの初回アクセス時に即座に表示される)の受け皿になる。 */
const TagPageLoading = () => (
  <Container maxWidth="4xl">
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </Container>
);

export default TagPageLoading;
