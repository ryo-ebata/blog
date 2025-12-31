import { getBgGradientColor, getBubbleColor, getTextColor } from './constants';
import type { BubbleState, TagBubble } from './types';

/** 中心からの距離に応じたスケールを計算（端はドットサイズまで縮小） */
export function getScaleAt(
  bubbleX: number,
  bubbleY: number,
  tileOffsetX: number,
  tileOffsetY: number,
  state: BubbleState
): number {
  const dx = bubbleX + tileOffsetX - state.centerX + state.offsetX;
  const dy = bubbleY + tileOffsetY - state.centerY + state.offsetY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 画面の対角線の半分を最大距離とする
  const maxDist = Math.sqrt(state.centerX ** 2 + state.centerY ** 2);

  // 中心では1.0、端では0.02（ほぼドット）になるように
  const normalizedDist = Math.min(dist / maxDist, 1);
  // easeOutQuadで端に近づくほど急激に小さくなる
  const scale = 1 - normalizedDist ** 1.5;

  return Math.max(0.02, scale);
}

/** 背景のグラデーションを描画 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  state: BubbleState,
  isDarkMode: boolean
): void {
  const centerColor = getBgGradientColor(isDarkMode);
  const maxRadius = Math.max(state.width, state.height) * 0.7;

  const gradient = ctx.createRadialGradient(
    state.centerX,
    state.centerY,
    0,
    state.centerX,
    state.centerY,
    maxRadius
  );

  // 中央から外側へ透明にフェードアウト
  gradient.addColorStop(0, `${centerColor}30`);
  gradient.addColorStop(0.4, `${centerColor}18`);
  gradient.addColorStop(0.7, `${centerColor}08`);
  gradient.addColorStop(1, `${centerColor}00`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);
}

/** バブルが画面内かどうか判定 */
function isInViewport(screenX: number, screenY: number, state: BubbleState): boolean {
  const margin = 100;
  return (
    screenX >= -margin &&
    screenX <= state.width + margin &&
    screenY >= -margin &&
    screenY <= state.height + margin
  );
}

/** 単一のバブルを描画 */
function drawSingleBubble(
  ctx: CanvasRenderingContext2D,
  bubble: TagBubble,
  scale: number,
  isSelected: boolean,
  isDarkMode: boolean
): void {
  const radiusX = bubble.radiusX * scale;
  const radiusY = bubble.radiusY * scale;

  // 1px未満は描画しない
  if (radiusY < 1) return;

  ctx.save();

  // スケールに応じて透明度を調整（小さいほど薄く）
  ctx.globalAlpha = Math.min(1, 0.3 + scale * 0.7);

  // 遠いバブルにはブラーを適用（小さいほど強く）
  if (scale < 0.5) {
    ctx.filter = `blur(${(0.5 - scale) * 3}px)`;
  }

  // バブル本体（カプセル型、小さい場合は円に近づく）
  ctx.fillStyle = getBubbleColor(isSelected, isDarkMode);
  ctx.beginPath();
  ctx.roundRect(-radiusX, -radiusY, radiusX * 2, radiusY * 2, radiusY);
  ctx.fill();

  // テキスト（スケールが十分大きい場合のみ）
  if (scale > 0.4 && radiusY > 6) {
    const fontSize = Math.max(8, 14 * scale);
    ctx.fillStyle = getTextColor(isSelected, isDarkMode);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${bubble.tag} ${bubble.count}`, 0, 0);
  }

  ctx.restore();
}

/** バブルを描画（位置計算込み） */
export function drawBubble(
  ctx: CanvasRenderingContext2D,
  bubble: TagBubble,
  tileOffsetX: number,
  tileOffsetY: number,
  state: BubbleState,
  selectedTags: string[],
  isDarkMode: boolean
): void {
  const screenX = bubble.x + tileOffsetX + state.offsetX;
  const screenY = bubble.y + tileOffsetY + state.offsetY;

  if (!isInViewport(screenX, screenY, state)) return;

  const scale = getScaleAt(bubble.x, bubble.y, tileOffsetX, tileOffsetY, state);
  const isSelected = selectedTags.includes(bubble.tag);

  ctx.save();
  ctx.translate(bubble.x + tileOffsetX, bubble.y + tileOffsetY);
  drawSingleBubble(ctx, bubble, scale, isSelected, isDarkMode);
  ctx.restore();
}

/** 全タイルのバブルを描画（無限ループ対応） */
export function drawAllBubbles(
  ctx: CanvasRenderingContext2D,
  state: BubbleState,
  selectedTags: string[],
  isDarkMode: boolean
): void {
  const tilesX = Math.ceil(state.width / state.gridWidth) + 1;
  const tilesY = Math.ceil(state.height / state.gridHeight) + 1;
  const startTileX = Math.floor(-state.offsetX / state.gridWidth);
  const startTileY = Math.floor(-state.offsetY / state.gridHeight);

  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const tileOffsetX = (startTileX + tx) * state.gridWidth;
      const tileOffsetY = (startTileY + ty) * state.gridHeight;

      for (const bubble of state.bubbles) {
        drawBubble(ctx, bubble, tileOffsetX, tileOffsetY, state, selectedTags, isDarkMode);
      }
    }
  }
}

/** ビネット効果（角を暗くして中央を目立たせる） */
export function drawVignette(
  ctx: CanvasRenderingContext2D,
  state: BubbleState,
  isDarkMode: boolean
): void {
  const { width, height, centerX, centerY } = state;
  const maxRadius = Math.sqrt(centerX ** 2 + centerY ** 2);

  // 四隅から中央に向かって透明になるグラデーション
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * 0.5, // 内側（透明開始）
    centerX,
    centerY,
    maxRadius // 外側（暗い）
  );

  const shadowColor = isDarkMode ? '0, 0, 0' : '255, 255, 255';
  gradient.addColorStop(0, `rgba(${shadowColor}, 0)`);
  gradient.addColorStop(0.5, `rgba(${shadowColor}, 0.15)`);
  gradient.addColorStop(0.8, `rgba(${shadowColor}, 0.4)`);
  gradient.addColorStop(1, `rgba(${shadowColor}, 0.7)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
