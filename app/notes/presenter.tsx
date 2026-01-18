'use client';

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { SearchInput } from '@/components/atoms';
import { Pagination } from '@/components/molecules';
import { BubbleTagFilter, Container, PostList } from '@/components/organisms';
import type { NoteMetadata } from '@/lib/notes';
import type { TagCount } from '@/lib/tags';

interface NotesListPresenterProps {
  notes: NoteMetadata[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  selectedTags: string[];
  tagCounts: TagCount[];
}

export function NotesListPresenter({
  notes,
  currentPage,
  totalPages,
  searchQuery,
  selectedTags,
  tagCounts,
}: NotesListPresenterProps) {
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
          <h1 className="font-bold scroll-m-20 text-3xl text-foreground">ノート</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            雑記や書き殴りの記事置き場
          </p>
        </div>

        <div className="space-y-6">
          <BubbleTagFilter
            tags={tagCounts}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
          <SearchInput value={searchQuery} onChange={handleSearchChange} />
          <PostList posts={notes} basePath="/notes" />
          {notes.length === 0 && (searchQuery || selectedTags.length > 0) && (
            <p className="text-center text-muted-foreground py-8">
              条件に一致するノートが見つかりませんでした
            </p>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/notes" />
        </div>
      </div>
    </Container>
  );
}
