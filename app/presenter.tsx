'use client';

import Link from 'next/link';
import { Container } from '@/components/composites/container';
import { PostCard } from '@/components/elements/post-card/post-card';
import type { PostMetadata } from '@/lib/posts';

interface HomePresenterProps {
  latestPosts: PostMetadata[];
}

export function HomePresenter({ latestPosts }: HomePresenterProps) {
  return (
    <Container maxWidth="4xl">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          ブログへようこそ
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          技術的な学びや日々の気づきを共有しています
        </p>
      </div>

      {latestPosts.length > 0 ? (
        <>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">最新記事</h2>
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
            >
              すべての記事を見る →
            </Link>
          </div>
          <div className="space-y-6">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} metadata={post} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">まだ記事がありません。</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            posts/ ディレクトリにMDXファイルを追加してください。
          </p>
        </div>
      )}
    </Container>
  );
}
