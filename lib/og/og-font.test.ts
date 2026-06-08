import { describe, expect, it } from 'vitest';
import { loadOgFont } from './og-font';

describe('loadOgFont', () => {
  it('フォントファイルを読み込んでArrayBufferを返す', async () => {
    const result = await loadOgFont();

    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBeGreaterThan(0);
  });
});
