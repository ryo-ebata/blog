#!/usr/bin/env node
/**
 * blog-obsidian/private/(下書き置き場)とblog-obsidian/.obsidian/(ローカル設定、
 * どちらもgit管理外)の実体をiCloud Drive配下へ移し、リポジトリ側からsymlinkで
 * 参照する状態にする。Mac/iPhone間でObsidianの下書きと設定(テーマ・Daily Notes設定・
 * プラグイン設定)を同期するためのセットアップ/復元スクリプト。.git・node_modules・.nextなどは
 * リポジトリの外側にあるため、iCloud同期の対象には一切含まれない。
 * 実行: node scripts/setup-obsidian-vault.mjs
 */
import { cp, lstat, mkdir, readdir, readlink, rename, rm, rmdir, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/* ObsidianアプリのiCloud統合が使う専用コンテナ配下に置くことで、
   iPhone側のObsidianアプリ起動画面のVault一覧に自動的に表示される
   (com~apple~CloudDocs直下の汎用領域だと毎回Filesピッカーでの手動選択が必要になる) */
const ICLOUD_VAULT_ROOT = path.join(
  os.homedir(),
  'Library',
  'Mobile Documents',
  'iCloud~md~obsidian',
  'Documents',
  'blog'
);

/* iCloud側もblog-obsidian/と同じ相対パス構造(private/配下にdaily・notesを置く)にする。
   iPhone側はICLOUD_VAULT_ROOT自体を1つのVaultとして開くため、
   .obsidian/daily-notes.jsonのfolder値("private/daily")のようなVaultルート相対パスの設定を
   Mac/iPhone両方で同じ意味に解決させるには、iCloud側の階層をMac側のVaultルートに揃える必要がある */
const TARGETS = [
  {
    local: path.join(process.cwd(), 'blog-obsidian', 'private'),
    remote: path.join(ICLOUD_VAULT_ROOT, 'private'),
  },
  {
    local: path.join(process.cwd(), 'blog-obsidian', '.obsidian'),
    remote: path.join(ICLOUD_VAULT_ROOT, '.obsidian'),
  },
];

const statOrNull = async (targetPath) =>
  lstat(targetPath).catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });

const isEmptyDir = async (dirPath) => {
  const entries = await readdir(dirPath).catch((error) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  return entries.length === 0;
};

/* iCloud DriveとリポジトリはどちらもHomeディレクトリ配下だが、
   別ボリューム構成の環境でも動くようEXDEVはcp+rmにフォールバックする */
const moveEntry = async (localDir, remoteDir, name) => {
  const src = path.join(localDir, name);
  const dest = path.join(remoteDir, name);
  await rename(src, dest).catch(async (error) => {
    if (error.code !== 'EXDEV') throw error;
    await cp(src, dest, { recursive: true });
    await rm(src, { recursive: true, force: true });
  });
};

const setupSymlink = async (local, remote) => {
  const label = path.relative(process.cwd(), local);
  const localStat = await statOrNull(local);

  if (localStat?.isSymbolicLink()) {
    const linkTarget = await readlink(local);
    if (linkTarget === remote) {
      console.log(`[setup-obsidian-vault] ${label} はセットアップ済みです。何もしません`);
      return;
    }
    throw new Error(
      `${label} は既に別のリンク先(${linkTarget})を指すsymlinkです。` +
        '意図しない上書きを避けるため、手動で確認してください。'
    );
  }

  const localHasContents = localStat ? !(await isEmptyDir(local)) : false;
  const remoteHasContents = !(await isEmptyDir(remote));

  if (localHasContents && remoteHasContents) {
    throw new Error(
      `${label} と ${remote} の両方にデータが存在します。` +
        '自動マージは行わないため、手動で内容を確認してから再実行してください。'
    );
  }

  await mkdir(remote, { recursive: true });

  if (localHasContents) {
    for (const entry of await readdir(local)) {
      await moveEntry(local, remote, entry);
    }
    console.log(`[setup-obsidian-vault] ${label} の中身を ${remote} へ移動しました`);
  } else if (remoteHasContents) {
    console.log(`[setup-obsidian-vault] iCloud側(${remote})の既存データをそのまま採用します`);
  } else {
    console.log(
      `[setup-obsidian-vault] ${label} は移行対象のデータがないため、空としてセットアップします`
    );
  }

  if (localStat) {
    await rmdir(local);
  }
  await symlink(remote, local, 'dir');
  console.log(`[setup-obsidian-vault] ${label} → ${remote} のsymlinkを作成しました`);
};

const main = async () => {
  for (const { local, remote } of TARGETS) {
    await setupSymlink(local, remote);
  }
};

main().catch((error) => {
  console.error('[setup-obsidian-vault] 失敗しました:', error.message);
  process.exitCode = 1;
});
