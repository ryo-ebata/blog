const MONTH_OFFSET = 1;
const PAD_LENGTH = 2;
const PAD_CHAR = '0';

/**
 * Dateを日本語の形式に変換する（YYYY年MM月DD日）
 */
export const formatDateJapanese = (date: Date | string | number): string =>
  new Date(date).toLocaleDateString('ja-JP', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/**
 * Dateを右の形式に変換する（YYYY.MM.DD）
 */
export const formatDate = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + MONTH_OFFSET).padStart(PAD_LENGTH, PAD_CHAR);
  const day = String(dateObj.getDate()).padStart(PAD_LENGTH, PAD_CHAR);
  return `${year}.${month}.${day}`;
};
