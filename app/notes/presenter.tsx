'use client';

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';

import { SearchInput } from '@/components/atoms';
import { Pagination } from '@/components/molecules';
import { BubbleTagFilter, Container, PostList } from '@/components/organisms';
import type { NoteMetadata } from '@/lib/notes';
import type { TagCount } from '@/lib/tags';

interface NotesListPresenterProps {
  currentPage: number;
  notes: NoteMetadata[];
  searchQuery: string;
  selectedTags: string[];
  tagCounts: TagCount[];
  totalPages: number;
}

const EMPTY_LENGTH = 0;

const useSearchParams = () =>
  useQueryStates(
    {
      page: parseAsString,
      search: parseAsString.withDefault(''),
      tags: parseAsArrayOf(parseAsString, ',').withDefault([]),
    },
    { clearOnDefault: true, shallow: false }
  );

interface PageHeaderProps {
  description: string;
  title: string;
}

const PageHeader = ({ description, title }: PageHeaderProps) => (
  <div className="mb-12 text-center space-y-4">
    <h1 className="font-bold scroll-m-20 text-3xl text-foreground">{title}</h1>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
  </div>
);

interface EmptyResultMessageProps {
  hasFilters: boolean;
  isEmpty: boolean;
}

const EmptyResultMessage = ({ hasFilters, isEmpty }: EmptyResultMessageProps) => {
  if (!isEmpty || !hasFilters) {
    return null;
  }

  return (
    <p className="text-center text-muted-foreground py-8">
      条件に一致するノートが見つかりませんでした
    </p>
  );
};

const getSearchValue = (value: string): string | null => {
  if (value) {
    return value;
  }
  return null;
};

const getNewTags = (selectedTags: string[], tag: string): string[] => {
  if (selectedTags.includes(tag)) {
    return selectedTags.filter((currentTag) => currentTag !== tag);
  }
  return [...selectedTags, tag];
};

const getTagsValue = (newTags: string[]): string[] | null => {
  if (newTags.length > EMPTY_LENGTH) {
    return newTags;
  }
  return null;
};

interface FilterSectionProps {
  currentPage: number;
  hasFilters: boolean;
  isEmpty: boolean;
  notes: NoteMetadata[];
  onSearchChange: (value: string) => void;
  onTagToggle: (tag: string) => void;
  searchQuery: string;
  selectedTags: string[];
  tagCounts: TagCount[];
  totalPages: number;
}

const FilterSection = ({
  currentPage,
  hasFilters,
  isEmpty,
  notes,
  onSearchChange,
  onTagToggle,
  searchQuery,
  selectedTags,
  tagCounts,
  totalPages,
}: FilterSectionProps) => (
  <div className="space-y-6">
    <BubbleTagFilter onTagToggle={onTagToggle} selectedTags={selectedTags} tags={tagCounts} />
    <SearchInput onChange={onSearchChange} value={searchQuery} />
    <PostList basePath="/notes" posts={notes} />
    <EmptyResultMessage hasFilters={hasFilters} isEmpty={isEmpty} />
    <Pagination basePath="/notes" currentPage={currentPage} totalPages={totalPages} />
  </div>
);

export const NotesListPresenter = ({
  currentPage,
  notes,
  searchQuery,
  selectedTags,
  tagCounts,
  totalPages,
}: NotesListPresenterProps) => {
  const [, setSearchParams] = useSearchParams();

  const handleSearchChange = (value: string) => {
    const searchValue = getSearchValue(value);
    setSearchParams({ page: null, search: searchValue });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = getNewTags(selectedTags, tag);
    const tagsValue = getTagsValue(newTags);
    setSearchParams({ page: null, tags: tagsValue });
  };

  const hasFilters = Boolean(searchQuery) || selectedTags.length > EMPTY_LENGTH;
  const isEmpty = notes.length === EMPTY_LENGTH;

  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <PageHeader description="雑記や書き殴りの記事置き場" title="ノート" />

        <FilterSection
          currentPage={currentPage}
          hasFilters={hasFilters}
          isEmpty={isEmpty}
          notes={notes}
          onSearchChange={handleSearchChange}
          onTagToggle={handleTagToggle}
          searchQuery={searchQuery}
          selectedTags={selectedTags}
          tagCounts={tagCounts}
          totalPages={totalPages}
        />
      </div>
    </Container>
  );
};
