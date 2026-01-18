import type { BubbleConfig } from './types';

/** テーマカラー定義 */
const COLORS = {
  bgGradient: { dark: '#e2e8f0', light: '#1e293b' },
  selected: { dark: '#60a5fa', light: '#3b82f6' },
  text: {
    selected: { dark: '#0d1117', light: '#ffffff' },
    unselected: { dark: '#e2e8f0', light: '#1e293b' },
  },
  unselected: { dark: '#475569', light: '#cbd5e1' },
} as const;

/** バブルの背景色を取得 */
export const getBubbleColor = (isSelected: boolean, isDark: boolean): string => {
  if (isSelected) {
    if (isDark) {
      return COLORS.selected.dark;
    }
    return COLORS.selected.light;
  }
  if (isDark) {
    return COLORS.unselected.dark;
  }
  return COLORS.unselected.light;
};

/** バブルのテキスト色を取得 */
export const getTextColor = (isSelected: boolean, isDark: boolean): string => {
  if (isSelected) {
    if (isDark) {
      return COLORS.text.selected.dark;
    }
    return COLORS.text.selected.light;
  }
  if (isDark) {
    return COLORS.text.unselected.dark;
  }
  return COLORS.text.unselected.light;
};

/** 背景グラデーションの中心色を取得 */
export const getBgGradientColor = (isDark: boolean): string => {
  if (isDark) {
    return COLORS.bgGradient.dark;
  }
  return COLORS.bgGradient.light;
};

/*
 * バブルの見た目設定
 * scaleFactor: スケール計算の基準距離
 * baseRadiusY: バブルの縦半径
 * charWidth: 文字幅（横半径計算用）
 * paddingX: 横方向の余白
 * paddingY: 縦方向の余白
 */
export const BUBBLE_CONFIG: BubbleConfig = {
  baseRadiusY: 18,
  charWidth: 8,
  paddingX: 6,
  paddingY: 6,
  scaleFactor: 250,
};

/** キャンバスの最大サイズ */
export const MAX_CANVAS_SIZE = 350;

/** クリック判定の閾値（これ以下の移動量ならクリックとみなす） */
export const CLICK_THRESHOLD = 10;

/** オフセット補間係数（滑らかなドラッグ用） */
export const INTERPOLATION_FACTOR = 0.1;
