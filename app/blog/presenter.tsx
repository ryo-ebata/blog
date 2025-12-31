'use client';

import { Container } from '@/components/composites/container';
import { PostList } from '@/components/elements';
import { Pagination } from '@/components/elements/pagination/pagination';
import { SearchInput } from '@/components/elements/search-input';
import { siteConfig } from '@/config/site';
import type { PostMetadata } from '@/lib/posts';
import { parseAsString, useQueryState } from 'nuqs';

interface BlogListPresenterProps {
  posts: PostMetadata[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

export function BlogListPresenter({
  posts,
  currentPage,
  totalPages,
  searchQuery,
}: BlogListPresenterProps) {
  const [, setSearch] = useQueryState(
    'search',
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }).withDefault('')
  );
  const [, setPage] = useQueryState('page', parseAsString.withOptions({ shallow: false }));

  const handleSearchChange = async (value: string) => {
    await setPage(null);
    await setSearch(value || null);
  };

  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <div className="mb-12 text-center space-y-4">
          <h1 className="font-bold scroll-m-20 text-3xl text-foreground">{siteConfig.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">すべてのブログ記事</p>
        </div>

        <div className="space-y-6">
          <SearchInput value={searchQuery} onChange={handleSearchChange} />
          <PostList posts={posts} />
          {posts.length === 0 && searchQuery && (
            <p className="text-center text-muted-foreground py-8">
              「{searchQuery}」に一致する記事が見つかりませんでした
            </p>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        </div>
      </div>
    </Container>
  );
}
