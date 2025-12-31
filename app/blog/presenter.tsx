'use client';

import { Container } from '@/components/composites/container';
import { PostList } from '@/components/elements';
import { Pagination } from '@/components/elements/pagination/pagination';
import { SearchInput } from '@/components/elements/search-input';
import type { PostMetadata } from '@/lib/posts';
import { parseAsString, useQueryState } from 'nuqs';

interface BlogListPresenterProps {
  posts: PostMetadata[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

const HEADING_TEXT = '$ ls -la ./blog';
const DESCRIPTION_TEXT = '// すべてのブログ記事';

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
          <h1 className="font-bold font-mono text-terminal-green terminal-glow scroll-m-20 text-3xl">
            {HEADING_TEXT}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
            {DESCRIPTION_TEXT}
          </p>
        </div>

        <div className="space-y-6">
          <SearchInput value={searchQuery} onChange={handleSearchChange} />
          <PostList posts={posts} />
          {posts.length === 0 && searchQuery && (
            <p className="text-center text-gray-500 py-8">
              「{searchQuery}」に一致する記事が見つかりませんでした
            </p>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        </div>
      </div>
    </Container>
  );
}
