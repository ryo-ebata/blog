import { Container } from '@/components/organisms';

/* /blog/[...slug]のInstant Navigations App Shell。
   Suspenseの暗黙境界(loading.tsx)としてルートセグメント全体を包む。 */
const BlogPostLoading = () => (
  <Container maxWidth="3xl">
    <div className="mx-auto max-w-[42rem] space-y-6">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="space-y-3">
        <div className="h-8 w-full animate-pulse rounded bg-muted" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-muted" />
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  </Container>
);

export default BlogPostLoading;
