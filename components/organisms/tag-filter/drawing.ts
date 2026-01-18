import type { BubbleState, TagBubble } from './types';

import { getBgGradientColor, getBubbleColor, getTextColor } from './constants';

/* マジックナンバー定数 */
const POWER_EXPONENT = 2;
const MAX_NORMALIZED_DIST = 1;
const SCALE_BASE = 1;
const SCALE_POWER = 1.5;
const MIN_SCALE = 0.02;
const MAX_RADIUS_MULTIPLIER = 0.7;
const GRADIENT_ZERO = 0;
const GRADIENT_STOP_1 = 0.4;
const GRADIENT_STOP_2 = 0.7;
const GRADIENT_STOP_3 = 1;
const FILL_START = 0;
const VIEWPORT_MARGIN = 100;
const MIN_RADIUS_Y = 1;
const ALPHA_BASE = 0.3;
const ALPHA_SCALE_MULTIPLIER = 0.7;
const ALPHA_MAX = 1;
const BLUR_THRESHOLD = 0.5;
const BLUR_MULTIPLIER = 3;
const RADIUS_MULTIPLIER = 2;
const TEXT_SCALE_THRESHOLD = 0.4;
const TEXT_RADIUS_THRESHOLD = 6;
const FONT_SIZE_MIN = 8;
const FONT_SIZE_BASE = 14;
const TEXT_POSITION = 0;
const TILE_OFFSET = 1;
const VIGNETTE_INNER_MULTIPLIER = 0.5;
const VIGNETTE_STOP_1 = 0.5;
const VIGNETTE_STOP_2 = 0.8;
const VIGNETTE_OPACITY_1 = 0.15;
const VIGNETTE_OPACITY_2 = 0.4;
const VIGNETTE_OPACITY_3 = 0.7;

/** スケール計算用のパラメータ */
interface ScaleParams {
  bubbleX: number;
  bubbleY: number;
  tileOffsetX: number;
  tileOffsetY: number;
  state: BubbleState;
}

/** 中心からの距離に応じたスケールを計算（端はドットサイズまで縮小） */
export const getScaleAt = (params: ScaleParams): number => {
  const { bubbleX, bubbleY, tileOffsetX, tileOffsetY, state } = params;
  const dx = bubbleX + tileOffsetX - state.centerX + state.offsetX;
  const dy = bubbleY + tileOffsetY - state.centerY + state.offsetY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxDist = Math.sqrt(state.centerX ** POWER_EXPONENT + state.centerY ** POWER_EXPONENT);
  const normalizedDist = Math.min(dist / maxDist, MAX_NORMALIZED_DIST);
  const scale = SCALE_BASE - normalizedDist ** SCALE_POWER;

  return Math.max(MIN_SCALE, scale);
};

/** 背景のグラデーションを描画 */
export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  state: BubbleState,
  isDarkMode: boolean
): void => {
  const centerColor = getBgGradientColor(isDarkMode);
  const maxRadius = Math.max(state.width, state.height) * MAX_RADIUS_MULTIPLIER;

  const gradient = ctx.createRadialGradient(
    state.centerX,
    state.centerY,
    GRADIENT_ZERO,
    state.centerX,
    state.centerY,
    maxRadius
  );

  gradient.addColorStop(GRADIENT_ZERO, `${centerColor}30`);
  gradient.addColorStop(GRADIENT_STOP_1, `${centerColor}18`);
  gradient.addColorStop(GRADIENT_STOP_2, `${centerColor}08`);
  gradient.addColorStop(GRADIENT_STOP_3, `${centerColor}00`);

  ctx.fillStyle = gradient;
  ctx.fillRect(FILL_START, FILL_START, state.width, state.height);
};

/** バブルが画面内かどうか判定 */
const isInViewport = (screenX: number, screenY: number, state: BubbleState): boolean =>
  screenX >= -VIEWPORT_MARGIN &&
  screenX <= state.width + VIEWPORT_MARGIN &&
  screenY >= -VIEWPORT_MARGIN &&
  screenY <= state.height + VIEWPORT_MARGIN;

/** バブル描画用のパラメータ */
interface DrawBubbleParams {
  ctx: CanvasRenderingContext2D;
  bubble: TagBubble;
  scale: number;
  isSelected: boolean;
  isDarkMode: boolean;
}

/** バブルのスタイルを適用 */
const applyBubbleStyle = (ctx: CanvasRenderingContext2D, scale: number): void => {
  ctx.globalAlpha = Math.min(ALPHA_MAX, ALPHA_BASE + scale * ALPHA_SCALE_MULTIPLIER);
  if (scale < BLUR_THRESHOLD) {
    ctx.filter = `blur(${(BLUR_THRESHOLD - scale) * BLUR_MULTIPLIER}px)`;
  }
};

/** バブル本体描画用パラメータ */
interface DrawBubbleBodyParams {
  ctx: CanvasRenderingContext2D;
  radiusX: number;
  radiusY: number;
  isSelected: boolean;
  isDarkMode: boolean;
}

/** バブル本体を描画 */
const drawBubbleBody = (params: DrawBubbleBodyParams): void => {
  const { ctx, radiusX, radiusY, isSelected, isDarkMode } = params;
  ctx.fillStyle = getBubbleColor(isSelected, isDarkMode);
  ctx.beginPath();
  ctx.roundRect(
    -radiusX,
    -radiusY,
    radiusX * RADIUS_MULTIPLIER,
    radiusY * RADIUS_MULTIPLIER,
    radiusY
  );
  ctx.fill();
};

/** バブルのテキストを描画 */
const drawBubbleText = (params: DrawBubbleParams, radiusY: number): void => {
  const { ctx, bubble, scale, isSelected, isDarkMode } = params;
  if (scale > TEXT_SCALE_THRESHOLD && radiusY > TEXT_RADIUS_THRESHOLD) {
    const fontSize = Math.max(FONT_SIZE_MIN, FONT_SIZE_BASE * scale);
    ctx.fillStyle = getTextColor(isSelected, isDarkMode);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${bubble.tag} ${bubble.count}`, TEXT_POSITION, TEXT_POSITION);
  }
};

/** 単一のバブルを描画 */
const drawSingleBubble = (params: DrawBubbleParams): void => {
  const { ctx, bubble, scale, isSelected, isDarkMode } = params;
  const radiusX = bubble.radiusX * scale;
  const radiusY = bubble.radiusY * scale;

  if (radiusY < MIN_RADIUS_Y) {
    return;
  }

  ctx.save();
  applyBubbleStyle(ctx, scale);
  drawBubbleBody({ ctx, isDarkMode, isSelected, radiusX, radiusY });
  drawBubbleText(params, radiusY);
  ctx.restore();
};

/** バブル描画のコンテキストパラメータ */
interface DrawBubbleContextParams {
  ctx: CanvasRenderingContext2D;
  bubble: TagBubble;
  tileOffsetX: number;
  tileOffsetY: number;
  state: BubbleState;
  selectedTags: string[];
  isDarkMode: boolean;
}

/** スクリーン座標計算用パラメータ */
interface ScreenPositionParams {
  bubble: TagBubble;
  tileOffsetX: number;
  tileOffsetY: number;
  state: BubbleState;
}

/** バブルのスクリーン座標を計算 */
const calculateScreenPosition = (
  params: ScreenPositionParams
): { screenX: number; screenY: number } => {
  const { bubble, tileOffsetX, tileOffsetY, state } = params;
  return {
    screenX: bubble.positionX + tileOffsetX + state.offsetX,
    screenY: bubble.positionY + tileOffsetY + state.offsetY,
  };
};

/** バブルを描画（位置計算込み） */
export const drawBubble = (params: DrawBubbleContextParams): void => {
  const { ctx, bubble, tileOffsetX, tileOffsetY, state, selectedTags, isDarkMode } = params;
  const { screenX, screenY } = calculateScreenPosition({ bubble, state, tileOffsetX, tileOffsetY });

  if (!isInViewport(screenX, screenY, state)) {
    return;
  }

  const scale = getScaleAt({
    bubbleX: bubble.positionX,
    bubbleY: bubble.positionY,
    state,
    tileOffsetX,
    tileOffsetY,
  });
  const isSelected = selectedTags.includes(bubble.tag);

  ctx.save();
  ctx.translate(bubble.positionX + tileOffsetX, bubble.positionY + tileOffsetY);
  drawSingleBubble({ bubble, ctx, isDarkMode, isSelected, scale });
  ctx.restore();
};

/** 全タイル描画用のパラメータ */
interface DrawAllBubblesParams {
  ctx: CanvasRenderingContext2D;
  state: BubbleState;
  selectedTags: string[];
  isDarkMode: boolean;
}

/** タイル範囲を計算 */
const calculateDrawTileRange = (
  state: BubbleState
): { tilesX: number; tilesY: number; startTileX: number; startTileY: number } => ({
  startTileX: Math.floor(-state.offsetX / state.gridWidth),
  startTileY: Math.floor(-state.offsetY / state.gridHeight),
  tilesX: Math.ceil(state.width / state.gridWidth) + TILE_OFFSET,
  tilesY: Math.ceil(state.height / state.gridHeight) + TILE_OFFSET,
});

/** 全タイルのバブルを描画（無限ループ対応） */
export const drawAllBubbles = (params: DrawAllBubblesParams): void => {
  const { ctx, state, selectedTags, isDarkMode } = params;
  const { tilesX, tilesY, startTileX, startTileY } = calculateDrawTileRange(state);

  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const tileOffsetX = (startTileX + tx) * state.gridWidth;
      const tileOffsetY = (startTileY + ty) * state.gridHeight;

      for (const bubble of state.bubbles) {
        drawBubble({ bubble, ctx, isDarkMode, selectedTags, state, tileOffsetX, tileOffsetY });
      }
    }
  }
};

/** シャドウカラーを取得 */
const getShadowColor = (isDarkMode: boolean): string => {
  if (isDarkMode) {
    return '13, 17, 23';
  }
  return '253, 253, 253';
};

/** ビネットグラデーション用パラメータ */
interface VignetteGradientParams {
  ctx: CanvasRenderingContext2D;
  centerX: number;
  centerY: number;
  maxRadius: number;
  shadowColor: string;
}

/** ビネット用グラデーションを作成 */
const createVignetteGradient = (params: VignetteGradientParams): CanvasGradient => {
  const { ctx, centerX, centerY, maxRadius, shadowColor } = params;
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * VIGNETTE_INNER_MULTIPLIER,
    centerX,
    centerY,
    maxRadius
  );
  gradient.addColorStop(GRADIENT_ZERO, `rgba(${shadowColor}, 0)`);
  gradient.addColorStop(VIGNETTE_STOP_1, `rgba(${shadowColor}, ${VIGNETTE_OPACITY_1})`);
  gradient.addColorStop(VIGNETTE_STOP_2, `rgba(${shadowColor}, ${VIGNETTE_OPACITY_2})`);
  gradient.addColorStop(GRADIENT_STOP_3, `rgba(${shadowColor}, ${VIGNETTE_OPACITY_3})`);
  return gradient;
};

/** ビネット効果（角を暗くして中央を目立たせる） */
export const drawVignette = (
  ctx: CanvasRenderingContext2D,
  state: BubbleState,
  isDarkMode: boolean
): void => {
  const { width, height, centerX, centerY } = state;
  const maxRadius = Math.sqrt(centerX ** POWER_EXPONENT + centerY ** POWER_EXPONENT);
  const shadowColor = getShadowColor(isDarkMode);
  const gradient = createVignetteGradient({ centerX, centerY, ctx, maxRadius, shadowColor });

  ctx.fillStyle = gradient;
  ctx.fillRect(FILL_START, FILL_START, width, height);
};
