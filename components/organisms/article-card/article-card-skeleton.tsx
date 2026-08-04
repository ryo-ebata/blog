import { Skeleton } from '@/components/atoms';

/* ArticleCardのレイアウトに合わせたローディングプレースホルダー。
   記事一覧系のSuspense fallback/loading.tsxから共通で使う。 */
export const ArticleCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
    <Skeleton className="aspect-[16/9] rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);
