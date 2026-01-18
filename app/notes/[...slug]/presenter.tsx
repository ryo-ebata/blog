'use client';

import { BackLink } from '@/components/atoms';
import { PostHeader } from '@/components/organisms';
import type { NoteMetadata } from '@/lib/notes';

interface NotesPostPresenterProps {
  metadata: NoteMetadata;
}

export const NotesPostPresenter = ({ metadata }: NotesPostPresenterProps) => (
  <>
    <BackLink href="/notes" label="ノート一覧に戻る" />
    <PostHeader metadata={metadata} />
  </>
);
