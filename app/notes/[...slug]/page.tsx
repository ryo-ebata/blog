import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { getAllNotes, getNoteBySlug } from '@/lib/notes';
import { NotesPostContainer } from './container';

interface Props {
  params: Promise<{ slug: string[] }>;
}

/* ISR設定: 1時間ごとに再検証 */
export const revalidate = 3600;

/* 新しい記事をオンデマンド生成 */
export const dynamicParams = true;

/*
 * 著者情報を取得するヘルパー関数
 */
const getAuthors = (author: string | undefined): string[] | undefined => {
  if (author) {
    return [author];
  }
  return undefined;
};

/*
 * 説明文を取得するヘルパー関数
 */
const getDescription = (description: string | undefined): string => {
  if (description) {
    return description;
  }
  return siteConfig.description;
};

/*
 * 静的パラメータ生成
 */
export const generateStaticParams = async () => {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.metadata.slug.split('/'),
  }));
};

/*
 * メタデータ生成（NOINDEX対応）
 */
export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;

  try {
    const note = await getNoteBySlug(slug);
    const noteUrl = `${siteConfig.url}/notes/${note.metadata.slug}`;

    const authors = getAuthors(note.metadata.author);
    const description = getDescription(note.metadata.description);

    return {
      ...generatePageMetadata({
        authors,
        description,
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
};

const NotesPostPage = async ({ params }: Props) => {
  const { slug } = await params;

  return <NotesPostContainer slug={slug} />;
};

export default NotesPostPage;
