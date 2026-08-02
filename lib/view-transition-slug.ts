import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'blog:vt-eyecatch-slug';

/**
 * アイキャッチの View Transition モーフィング対象となる記事の slug を記録する。
 * 一覧ページの該当カードだけがこの slug を見てモーフィング対象になる。
 */
export const markEyecatchViewTransition = (slug: string) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, slug);
  } catch {
    /* プライベートブラウジング等で sessionStorage が使えない場合は何もしない */
  }
};

const getSnapshot = (): string | null => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const getServerSnapshot = (): string | null => null;

/* 同一タブ内での sessionStorage 更新を通知する仕組みは無い(storage イベントは他タブのみ)。
   一覧ページが新規マウントされるタイミングでスナップショットを読めれば十分なため subscribe は no-op。 */
const subscribe = () => () => {};

export const useEyecatchViewTransitionSlug = (): string | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
