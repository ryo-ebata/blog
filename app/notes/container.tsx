import { paginateItems } from '@/lib/pagination';
import { getAllNotes } from '@/lib/notes';
import { filterPostsByTitle } from '@/lib/search';
import { aggregateTags, filterPostsByTags } from '@/lib/tags';
import { NotesListPresenter } from './presenter';

interface NotesListContainerProps {
  currentPage: number;
  searchQuery: string;
  selectedTags: string[];
}

const NOTES_PER_PAGE = 10;

export async function NotesListContainer({
  currentPage,
  searchQuery,
  selectedTags,
}: NotesListContainerProps) {
  try {
    const allNotes = await getAllNotes();
    const allNotesMetadata = allNotes.map((note) => note.metadata);

    const tagCounts = aggregateTags(allNotesMetadata);
    const filteredByTags = filterPostsByTags(allNotesMetadata, selectedTags);
    const filteredNotes = filterPostsByTitle(filteredByTags, searchQuery);
    const { items: notes, totalPages } = paginateItems(filteredNotes, currentPage, NOTES_PER_PAGE);

    return (
      <NotesListPresenter
        notes={notes}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        tagCounts={tagCounts}
      />
    );
  } catch (error) {
    console.error('Failed to load notes:', error);
    return (
      <NotesListPresenter
        notes={[]}
        totalPages={0}
        currentPage={currentPage}
        searchQuery=""
        selectedTags={[]}
        tagCounts={[]}
      />
    );
  }
}
