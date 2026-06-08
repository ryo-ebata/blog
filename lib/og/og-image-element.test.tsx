import { describe, expect, it } from 'vitest';
import { OgImageElement } from './og-image-element';

describe('OgImageElement', () => {
  it('タイトルを表示する', () => {
    const element = OgImageElement({ title: 'テストタイトル' });
    const rendered = JSON.stringify(element);

    expect(rendered).toContain('テストタイトル');
  });

  it('サブタイトルを表示する', () => {
    const element = OgImageElement({ title: 'メイン', subtitle: 'サブ' });
    const rendered = JSON.stringify(element);

    expect(rendered).toContain('サブ');
  });

  it('サブタイトルなしでもレンダリングできる', () => {
    const element = OgImageElement({ title: 'タイトルのみ' });
    const rendered = JSON.stringify(element);

    expect(rendered).toContain('タイトルのみ');
  });

  it('サイト名を含む', () => {
    const element = OgImageElement({ title: 'テスト' });
    const rendered = JSON.stringify(element);

    expect(rendered).toContain('ebaryo.dev');
  });
});
