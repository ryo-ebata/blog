import type { BubbleConfig } from './types';

/** テーマカラー定義 */
const COLORS = {
  unselected: { light: '#cbd5e1', dark: '#475569' },
  selected: { light: '#3b82f6', dark: '#60a5fa' },
  bgGradient: { light: '#1e293b', dark: '#e2e8f0' },
  text: {
    selected: { light: '#ffffff', dark: '#0d1117' },
    unselected: { light: '#1e293b', dark: '#e2e8f0' },
  },
} as const;

/** バブルの背景色を取得 */
export const getBubbleColor = (isSelected: boolean, isDark: boolean): string =>
  isSelected
    ? isDark
      ? COLORS.selected.dark
      : COLORS.selected.light
    : isDark
      ? COLORS.unselected.dark
      : COLORS.unselected.light;

/** バブルのテキスト色を取得 */
export const getTextColor = (isSelected: boolean, isDark: boolean): string =>
  isSelected
    ? isDark
      ? COLORS.text.selected.dark
      : COLORS.text.selected.light
    : isDark
      ? COLORS.text.unselected.dark
      : COLORS.text.unselected.light;

/** 背景グラデーションの中心色を取得 */
export const getBgGradientColor = (isDark: boolean): string =>
  isDark ? COLORS.bgGradient.dark : COLORS.bgGradient.light;

/** バブルの見た目設定 */
export const BUBBLE_CONFIG: BubbleConfig = {
  scaleFactor: 250, // スケール計算の基準距離
  baseRadiusY: 18, // バブルの縦半径
  charWidth: 8, // 文字幅（横半径計算用）
  paddingX: 6, // 横方向の余白
  paddingY: 6, // 縦方向の余白
};

/** キャンバスの最大サイズ */
export const MAX_CANVAS_SIZE = 350;

/** クリック判定の閾値（これ以下の移動量ならクリックとみなす） */
export const CLICK_THRESHOLD = 10;

/** オフセット補間係数（滑らかなドラッグ用） */
export const INTERPOLATION_FACTOR = 0.1;
