---
title: 'Next.js 16ブログへようこそ'
date: '2024-01-15'
description: 'Next.js 16 App Routerで構築された個人ブログの紹介記事です。'
tags: ['nextjs', 'blog', 'introduction']
---

# Next.js 16ブログへようこそ

このブログは、Next.js 16 App Routerを使用して構築されました。

## 主な機能

- **App Router**: Next.js 16の最新ルーティングシステム
- **ISR**: Incremental Static Regenerationによる高速なページ生成
- **Markdown対応**: Obsidianで執筆したMarkdownファイルをそのまま使用可能
- **シンタックスハイライト**: コードブロックの自動ハイライト

## コード例

以下はTypeScriptのコード例です：

```typescript
export async function getPostBySlug(slug: string) {
  const fileContents = fs.readFileSync(
    path.join(postsDirectory, `${slug}.md`),
    'utf8'
  )
  
  const { data, content } = matter(fileContents)
  return { data, content }
}
```

## リスト

- 項目1
- 項目2
- 項目3

## 引用

> これは引用ブロックの例です。
> 重要な情報や参考になる内容をここに記載できます。

## リンク

[Next.js公式サイト](https://nextjs.org)を確認してください。

---

記事を追加するには、`posts/` ディレクトリにMarkdownファイルを追加するだけです。

