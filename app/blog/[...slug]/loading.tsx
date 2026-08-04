import { Skeleton } from '@/components/atoms';
import { Container } from '@/components/organisms';

/* /blog/[...slug]のInstant Navigations App Shell。
   Suspenseの暗黙境界(loading.tsx)としてルートセグメント全体を包む。 */
const BlogPostLoading = () => (
  <Container maxWidth="3xl">
    <div className="mx-auto max-w-[42rem] space-y-6">
      <Skeleton className="h-4 w-40" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-2/3" />
      </div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="aspect-[16/9] w-full rounded-xl" />
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </Container>
);

export default BlogPostLoading;
