'use client';

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { SearchInput } from '@/components/atoms';
import { Pagination } from '@/components/molecules';
import { BubbleTagFilter, Container, PostList } from '@/components/organisms';
import { siteConfig } from '@/config/site';
import type { PostMetadata } from '@/lib/posts';
import type { TagCount } from '@/lib/tags';

interface BlogListPresenterProps {
  posts: PostMetadata[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  selectedTags: string[];
  tagCounts: TagCount[];
}

export function BlogListPresenter({
  posts,
  currentPage,
  totalPages,
  searchQuery,
  selectedTags,
  tagCounts,
}: BlogListPresenterProps) {
  const [, setSearchParams] = useQueryStates(
    {
      page: parseAsString,
      search: parseAsString.withDefault(''),
      tags: parseAsArrayOf(parseAsString, ',').withDefault([]),
    },
    { clearOnDefault: true, shallow: false }
  );

  const handleSearchChange = (value: string) => {
    setSearchParams({ page: null, search: value || null });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSearchParams({ page: null, tags: newTags.length > 0 ? newTags : null });
  };

  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <div className="mb-12 text-center space-y-4">
          <h1 className="font-bold scroll-m-20 text-3xl text-foreground">{siteConfig.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">すべてのブログ記事</p>
        </div>

        <div className="space-y-6">
          <BubbleTagFilter
            tags={tagCounts}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
          <SearchInput value={searchQuery} onChange={handleSearchChange} />
          <PostList posts={posts} />
          {posts.length === 0 && (searchQuery || selectedTags.length > 0) && (
            <p className="text-center text-muted-foreground py-8">
              条件に一致する記事が見つかりませんでした
            </p>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        </div>
      </div>
    </Container>
  );
}
