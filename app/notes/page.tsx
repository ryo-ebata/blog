import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { NotesListContainer } from './container';

interface NotesPageProps {
  searchParams: Promise<{ page?: string; search?: string; tags?: string }>;
}

export const revalidate = 3600; // 1時間ごとに再検証

export const metadata = {
  ...generatePageMetadata({
    description: `${siteConfig.name}の雑記・書き殴りノート一覧です。`,
    title: 'ノート',
    url: `${siteConfig.url}/notes`,
  }),
  robots: {
    follow: true,
    index: false,
  },
};

export default async function NotesListPage({ searchParams }: NotesPageProps) {
  const { page, search, tags } = await searchParams;
  const selectedTags = tags ? tags.split(',').filter(Boolean) : [];

  return (
    <NotesListContainer
      currentPage={page ? parseInt(page, 10) : 1}
      searchQuery={search ?? ''}
      selectedTags={selectedTags}
    />
  );
}
