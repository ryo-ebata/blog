import { describe, expect, it } from 'vitest';
import { formatDate, formatDateJapanese } from './date';

describe('formatDateJapanese', () => {
  it('日本語形式でフォーマットする', () => {
    const result = formatDateJapanese('2025-01-15T00:00:00Z');
    expect(result).toContain('2025');
    expect(result).toContain('1');
    expect(result).toContain('15');
  });

  it('Dateオブジェクトを受け取れる', () => {
    const result = formatDateJapanese(new Date('2025-12-25T00:00:00Z'));
    expect(result).toContain('2025');
    expect(result).toContain('12');
    expect(result).toContain('25');
  });

  it('数値タイムスタンプを受け取れる', () => {
    const timestamp = new Date('2025-03-01T00:00:00Z').getTime();
    const result = formatDateJapanese(timestamp);
    expect(result).toContain('2025');
  });
});

describe('formatDate', () => {
  it('YYYY.MM.DD形式でフォーマットする', () => {
    const result = formatDate('2025-01-15T00:00:00Z');
    expect(result).toBe('2025.01.15');
  });

  it('月と日をゼロパディングする', () => {
    const result = formatDate('2025-03-05T00:00:00Z');
    expect(result).toBe('2025.03.05');
  });

  it('2桁の月・日の場合もフォーマットする', () => {
    const result = formatDate('2025-12-25T00:00:00Z');
    expect(result).toBe('2025.12.25');
  });

  it('Dateオブジェクトを受け取れる', () => {
    const result = formatDate(new Date('2025-06-01T00:00:00Z'));
    expect(result).toBe('2025.06.01');
  });
});
