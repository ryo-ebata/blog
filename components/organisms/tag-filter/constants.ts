import type { BubbleConfig } from './types';

/** テーマカラー定義（暖色基調: テラコッタ + 生成り/チャコール） */
const COLORS = {
  bgGradient: { dark: '#e8e3da', light: '#3a3733' },
  selected: { dark: '#d98b6a', light: '#b5613f' },
  text: {
    selected: { dark: '#1c1a17', light: '#faf8f4' },
    unselected: { dark: '#e8e3da', light: '#3a3733' },
  },
  unselected: { dark: '#5a544b', light: '#d8cfc0' },
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
