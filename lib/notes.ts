import { unstable_cache } from 'next/cache';
import path from 'node:path';
import {
  type BaseContentData,
  type BaseContentMetadata,
  getAllContent,
  getAllContentMetadataInternal,
  getContentBySlug,
} from './content';

const notesDirectory = path.join(process.cwd(), 'notes');

/* NoteMetadataはBaseContentMetadataのエイリアス */
export type NoteMetadata = BaseContentMetadata;

/* NoteDataはBaseContentDataのエイリアス */
export type NoteData = BaseContentData;

/* メタデータのみを取得（内部実装） */
const getAllNotesMetadataInternal = () =>
  Promise.resolve(getAllContentMetadataInternal(notesDirectory));

/* すべてのノートのメタデータを取得（キャッシュ付き） */
const REVALIDATE_INTERVAL_SECONDS = 3600;

export const getAllNotesMetadata = unstable_cache(
  getAllNotesMetadataInternal,
  ['all-notes-metadata'],
  {
    revalidate: REVALIDATE_INTERVAL_SECONDS,
    tags: ['notes'],
  }
);

/* すべてのノートを取得（メタデータ + Content） */
export const getAllNotes = async (): Promise<NoteData[]> => {
  const notesWithFiles = await getAllNotesMetadata();
  return getAllContent(notesDirectory, notesWithFiles);
};

/* スラッグからノートを取得 */
export const getNoteBySlug = (slug: string | string[]): Promise<NoteData> =>
  getContentBySlug(slug, notesDirectory, 'Note');
