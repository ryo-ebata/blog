import { NextResponse } from 'next/server';

const BUTTONDOWN_ENDPOINT = 'https://api.buttondown.email/v1/subscribers';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HTTP_BAD_REQUEST = 400;
const HTTP_SERVICE_UNAVAILABLE = 503;
const HTTP_BAD_GATEWAY = 502;

interface SubscribeBody {
  email?: string;
  /** ハニーポット(bot が埋めるダミー項目)。値が入っていれば bot とみなす。 */
  website?: string;
}

/**
 * ニュースレター購読プロキシ。サーバ専用の BUTTONDOWN_API_KEY を用いて購読登録する。
 * キーが未設定なら 503。ハニーポット検出時は成功を装って黙殺する。
 */
export const POST = async (request: Request) => {
  const apiKey = process.env.BUTTONDOWN_API_KEY ?? '';
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: '購読は現在利用できません。' },
      { status: HTTP_SERVICE_UNAVAILABLE }
    );
  }

  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: '不正なリクエストです。' },
      { status: HTTP_BAD_REQUEST }
    );
  }

  /* ハニーポットに値があれば bot とみなし、成功を装って黙殺 */
  if (body.website) {
    return NextResponse.json({ ok: true, message: '登録しました。' });
  }

  const email = (body.email ?? '').trim();
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, message: 'メールアドレスの形式が正しくありません。' },
      { status: HTTP_BAD_REQUEST }
    );
  }

  try {
    const response = await fetch(BUTTONDOWN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (response.ok) {
      return NextResponse.json({
        ok: true,
        message: '登録しました。確認メールをご確認ください。',
      });
    }
    /* 既に登録済み等(プロバイダが 400 を返す)はユーザー向けに穏当な文言で返す */
    if (response.status === HTTP_BAD_REQUEST) {
      return NextResponse.json({
        ok: false,
        message: 'すでに登録済みか、登録できませんでした。',
      });
    }
    return NextResponse.json(
      { ok: false, message: '登録に失敗しました。時間をおいて再度お試しください。' },
      { status: HTTP_BAD_GATEWAY }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: '通信エラーが発生しました。' },
      { status: HTTP_BAD_GATEWAY }
    );
  }
};
