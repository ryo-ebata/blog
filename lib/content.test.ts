import { describe, expect, it } from 'vitest';
import { isFuturePost } from './content';

describe('isFuturePost', () => {
  const today = new Date('2025-06-15T12:00:00Z');

  it('createdAtが未来日付の場合trueを返す', () => {
    expect(isFuturePost('2025-06-16T00:00:00Z', '2025-06-10T00:00:00Z', today)).toBe(true);
  });

  it('updatedAtが未来日付の場合trueを返す', () => {
    expect(isFuturePost('2025-06-10T00:00:00Z', '2025-06-16T00:00:00Z', today)).toBe(true);
  });

  it('両方過去日付の場合falseを返す', () => {
    expect(isFuturePost('2025-06-10T00:00:00Z', '2025-06-14T00:00:00Z', today)).toBe(false);
  });

  it('当日の場合falseを返す', () => {
    expect(isFuturePost('2025-06-15T00:00:00Z', '2025-06-15T00:00:00Z', today)).toBe(false);
  });

  it('today引数を省略した場合デフォルトで現在日付を使用する', () => {
    const pastDate = '2020-01-01T00:00:00Z';
    expect(isFuturePost(pastDate, pastDate)).toBe(false);
  });
});
