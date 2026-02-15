import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';
import { envConfig } from '@/config/env';
import { logger } from '@/lib/logger';

const UNAUTHORIZED_STATUS = 401;
const INTERNAL_ERROR_STATUS = 500;

export const POST = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get('secret');

  /* シークレットトークン検証 */
  if (secret !== envConfig.revalidate.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid token' }, { status: UNAUTHORIZED_STATUS });
  }

  try {
    const { slug } = await request.json();

    if (slug) {
      /* 特定の記事を再検証 */
      revalidatePath(`/blog/${slug}`);
    } else {
      /* ブログ一覧を再検証 */
      revalidatePath('/blog');
    }

    return Response.json({ now: Date.now(), revalidated: true });
  } catch (error) {
    logger.error('再検証に失敗しました', { source: 'revalidate' }, error);
    return Response.json({ message: 'Error' }, { status: INTERNAL_ERROR_STATUS });
  }
};
