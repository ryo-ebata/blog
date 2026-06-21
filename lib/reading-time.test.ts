import { describe, expect, it } from 'vitest';

import { getReadingTimeMinutes, READING_CHARS_PER_MINUTE } from './reading-time';

describe('getReadingTimeMinutes', () => {
  it('0文字でも最低1分を返す', () => {
    expect(getReadingTimeMinutes(0)).toBe(1);
  });

  it('1分未満は1分に切り上げる', () => {
    expect(getReadingTimeMinutes(1)).toBe(1);
    expect(getReadingTimeMinutes(READING_CHARS_PER_MINUTE)).toBe(1);
  });

  it('端数は切り上げる', () => {
    expect(getReadingTimeMinutes(READING_CHARS_PER_MINUTE + 1)).toBe(2);
    expect(getReadingTimeMinutes(READING_CHARS_PER_MINUTE * 3)).toBe(3);
    expect(getReadingTimeMinutes(READING_CHARS_PER_MINUTE * 3 + 1)).toBe(4);
  });
});
