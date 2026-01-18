import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/config/site';

import { NotesListContainer } from './container';

interface NotesPageProps {
  searchParams: Promise<{ page?: string; search?: string; tags?: string }>;
}

/* 1時間ごとに再検証 */
export const revalidate = 3600;

const DEFAULT_PAGE = 1;
const BASE_RADIX = 10;

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

/* タグ文字列をパースしてタグ配列を返す */
const parseTags = (tags: string | undefined): string[] => {
  if (tags) {
    return tags.split(',').filter(Boolean);
  }
  return [];
};

/* ページ番号文字列をパースして数値を返す */
const parsePageNumber = (page: string | undefined): number => {
  if (page) {
    return parseInt(page, BASE_RADIX);
  }
  return DEFAULT_PAGE;
};

/* 検索クエリを正規化する */
const normalizeSearchQuery = (search: string | undefined): string => {
  if (search) {
    return search;
  }
  return '';
};

const NotesListPage = async ({ searchParams }: NotesPageProps) => {
  const { page, search, tags } = await searchParams;
  const selectedTags = parseTags(tags);
  const currentPage = parsePageNumber(page);
  const searchQuery = normalizeSearchQuery(search);

  return (
    <NotesListContainer
      currentPage={currentPage}
      searchQuery={searchQuery}
      selectedTags={selectedTags}
    />
  );
};

export default NotesListPage;
