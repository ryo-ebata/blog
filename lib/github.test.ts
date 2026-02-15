import { describe, expect, it } from 'vitest';
import { createSuggestEditUrl } from './github';

describe('createSuggestEditUrl', () => {
  it('正しいGitHub Issue URLを生成する', () => {
    const url = createSuggestEditUrl('テスト記事', 'test-post');
    expect(url).toContain('https://github.com/ryo-ebata/ebaryo.dev/issues/new');
    expect(url).toContain('title=');
    expect(url).toContain('body=');
  });

  it('タイトルにエンコードされた記事タイトルが含まれる', () => {
    const url = createSuggestEditUrl('テスト記事', 'test-post');
    const urlObj = new URL(url);
    const title = urlObj.searchParams.get('title');
    expect(title).toContain('テスト記事');
  });

  it('本文にスラッグが含まれる', () => {
    const url = createSuggestEditUrl('テスト記事', 'test-post');
    const urlObj = new URL(url);
    const body = urlObj.searchParams.get('body');
    expect(body).toContain('test-post');
  });

  it('特殊文字を含むタイトルを正しくエンコードする', () => {
    const url = createSuggestEditUrl('React & TypeScript', 'react-ts');
    expect(url).toContain('https://github.com/ryo-ebata/ebaryo.dev/issues/new');
  });
});
