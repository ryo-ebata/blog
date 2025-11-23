import Link from 'next/link';
import type { PostData } from '@/lib/posts';
import { TagList } from './tag-list';

type PostCardProps = {
  post: PostData;
};

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors duration-200">
          {post.title}
        </h2>
      </Link>

      <time className="text-gray-600 text-sm block mt-2">{formattedDate}</time>

      {post.description && <p className="mt-3 text-gray-700 leading-relaxed">{post.description}</p>}

      {post.tags && <TagList tags={post.tags} />}
    </article>
  );
}
