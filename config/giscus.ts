/**
 * giscus(GitHub Discussions コメント)設定。
 * すべて NEXT_PUBLIC_GISCUS_* 環境変数から読み込み、未設定時はコメント欄を非表示にする
 * (config/ads.ts と同じく env 未設定で自動非表示の方針)。
 *
 * 取得方法: GitHub で Discussions を有効化 → https://giscus.app でリポジトリを登録し
 * repo / repo-id / category / category-id を発行する。
 */
export const giscusConfig = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? '',
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '',
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? '',
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '',
} as const;

/** giscus が有効か(必須IDが揃っているか) */
export const isGiscusEnabled =
  giscusConfig.repo !== '' && giscusConfig.repoId !== '' && giscusConfig.categoryId !== '';
