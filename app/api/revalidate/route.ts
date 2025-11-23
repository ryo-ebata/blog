import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // シークレットトークン検証
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const { slug } = await request.json();

    if (slug) {
      // 特定の記事を再検証
      revalidatePath(`/blog/${slug}`);
    } else {
      // ブログ一覧を再検証
      revalidatePath('/blog');
    }

    return Response.json({ revalidated: true, now: Date.now() });
  } catch {
    return Response.json({ message: 'Error' }, { status: 500 });
  }
}
