import { getAllNotes } from '@/lib/notes';
import { paginateItems } from '@/lib/pagination';
import { filterPostsByTitle } from '@/lib/search';
import { aggregateTags, filterPostsByTags } from '@/lib/tags';
import { NotesListPresenter } from './presenter';

interface NotesListContainerProps {
  currentPage: number;
  searchQuery: string;
  selectedTags: string[];
}

const NOTES_PER_PAGE = 10;

export const NotesListContainer = async ({
  currentPage,
  searchQuery,
  selectedTags,
}: NotesListContainerProps) => {
  try {
    const allNotes = await getAllNotes();
    const allNotesMetadata = allNotes.map((note) => note.metadata);

    const tagCounts = aggregateTags(allNotesMetadata);
    const filteredByTags = filterPostsByTags(allNotesMetadata, selectedTags);
    const filteredNotes = filterPostsByTitle(filteredByTags, searchQuery);
    const { items: notes, totalPages } = paginateItems(filteredNotes, currentPage, NOTES_PER_PAGE);

    return (
      <NotesListPresenter
        currentPage={currentPage}
        notes={notes}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        tagCounts={tagCounts}
        totalPages={totalPages}
      />
    );
  } catch {
    return (
      <NotesListPresenter
        currentPage={currentPage}
        notes={[]}
        searchQuery=""
        selectedTags={[]}
        tagCounts={[]}
        totalPages={0}
      />
    );
  }
};
