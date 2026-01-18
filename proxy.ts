import { type NextRequest, NextResponse } from 'next/server';

/**
 * MiddlewareからProxyに命名が変更された（@referenceを参照）
 * リクエストが完了する前にコードが実行される。
 *
 * 以下が公式が推奨しているユースケースシナリオ。
 *
 * - 全てのページまたは一部のページのヘッダーを変更する
 * - A/Bテストや実験に基づいて異なるページに書き換える
 * - 受信リクエストのプロパティに基づくプログラムによるリダイレクト
 *
 * （単純なリダイレクトの場合は、next.config.tsの`redirects`を推奨）
 *
 * @reference https://nextjs.org/docs/app/getting-started/proxy
 */
export const proxy = (_request: NextRequest): NextResponse => NextResponse.next();
