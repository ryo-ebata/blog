/**
 * Dateを日本語の形式に変換する（YYYY年MM月DD日）
 */
export function formatDateJapanese(date: Date | string | number) {
  return new Date(date).toLocaleDateString('ja-JP', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Dateを右の形式に変換する（YYYY.MM.DD）
 */
export function formatDate(date: Date | string | number) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}
