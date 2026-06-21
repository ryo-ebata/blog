/** 日本語本文(コードブロック除外済み)の基準読書速度。字/分 */
export const READING_CHARS_PER_MINUTE = 500;

/**
 * 文字数から読了時間(分)を算出する。最低 1 分に丸める。
 */
export const getReadingTimeMinutes = (characterCount: number): number => {
  if (characterCount <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(characterCount / READING_CHARS_PER_MINUTE));
};
