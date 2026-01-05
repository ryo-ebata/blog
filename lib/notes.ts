import path from 'node:path';
import { unstable_cache } from 'next/cache';
import type { BaseContentData, BaseContentMetadata } from './content';
import { getAllContent, getAllContentMetadataInternal, getContentBySlug } from './content';

const notesDirectory = path.join(process.cwd(), 'notes');

// NoteMetadataはBaseContentMetadataのエイリアス
export type NoteMetadata = BaseContentMetadata;

// NoteDataはBaseContentDataのエイリアス
export type NoteData = BaseContentData;

// メタデータのみを取得（内部実装）
async function getAllNotesMetadataInternal() {
  return getAllContentMetadataInternal(notesDirectory);
}

// すべてのノートのメタデータを取得（キャッシュ付き）
export const getAllNotesMetadata = unstable_cache(
  getAllNotesMetadataInternal,
  ['all-notes-metadata'],
  {
    revalidate: 3600, // 1時間ごとに再検証
    tags: ['notes'],
  }
);

// すべてのノートを取得（メタデータ + Content）
export async function getAllNotes(): Promise<NoteData[]> {
  const notesWithFiles = await getAllNotesMetadata();
  return getAllContent(notesDirectory, notesWithFiles);
}

// スラッグからノートを取得
export async function getNoteBySlug(slug: string | string[]): Promise<NoteData> {
  return getContentBySlug(slug, notesDirectory, 'Note');
}
