import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { getAllNotes, getNoteBySlug } from '@/lib/notes';
import { NotesPostContainer } from './container';

interface Props {
  params: Promise<{ slug: string[] }>;
}

// 静的パラメータ生成
export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.metadata.slug.split('/'),
  }));
}

// メタデータ生成（NOINDEX対応）
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  try {
    const note = await getNoteBySlug(slug);
    const noteUrl = `${siteConfig.url}/notes/${note.metadata.slug}`;

    return {
      ...generatePageMetadata({
        authors: note.metadata.author ? [note.metadata.author] : undefined,
        description: note.metadata.description || siteConfig.description,
        imageAlt: note.metadata.title,
        modifiedTime: note.metadata.updatedAt,
        publishedTime: note.metadata.createdAt,
        tags: note.metadata.tags,
        title: note.metadata.title,
        type: 'article',
        url: noteUrl,
      }),
      robots: {
        follow: true,
        index: false,
      },
    };
  } catch {
    return {
      robots: {
        follow: true,
        index: false,
      },
    };
  }
}

export default async function NotesPostPage({ params }: Props) {
  const { slug } = await params;

  return <NotesPostContainer slug={slug} />;
}

// ISR設定
export const revalidate = 3600; // 1時間
export const dynamicParams = true; // 新しい記事をオンデマンド生成
