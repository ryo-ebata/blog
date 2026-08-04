import { Skeleton } from '@/components/atoms';
import { ArticleCardSkeleton, Container } from '@/components/organisms';

const CARD_COUNT = 6;
const TAG_PILL_COUNT = 5;

/* app/blog/page.tsxのSuspense fallback。/blogがInstant Navigationsの
   App Shellとしてプリロードされる際に表示される読み込み中の見た目を
   PostList/ArticleCardのレイアウトに合わせて再現している。 */
export const BlogListSkeleton = () => (
  <Container maxWidth="4xl">
    <div className="space-y-12">
      <div className="mb-12 space-y-4 text-center">
        <Skeleton className="mx-auto h-9 w-48" />
        <Skeleton className="mx-auto h-6 w-64" />
      </div>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: TAG_PILL_COUNT }, (_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  </Container>
);
