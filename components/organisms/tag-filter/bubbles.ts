import type { TagCount } from '@/lib/tags';
import type { BubbleState, TagBubble } from './types';

import { getScaleAt } from './drawing';
import { BUBBLE_CONFIG } from './constants';

/* マジックナンバー定数 */
const TEXT_LENGTH_OFFSET = 1;
const MIN_RADIUS_X = 25;
const RADIUS_X_DIVISOR = 2;
const RADIUS_X_PADDING = 12;
const GRID_MULTIPLIER = 2;
const HALF_DIVISOR = 2;
const POWER_EXPONENT = 2;
const INITIAL_POSITION = 0;
const REDUCE_INITIAL = 0;
const ODD_ROW_REMAINDER = 1;
const TILE_OFFSET = 1;

/** タグからバブルデータを生成 */
const createBubbleFromTag = (tag: TagCount): TagBubble => {
  const textLength = tag.tag.length + String(tag.count).length + TEXT_LENGTH_OFFSET;
  const radiusX = Math.max(
    MIN_RADIUS_X,
    (textLength * BUBBLE_CONFIG.charWidth) / RADIUS_X_DIVISOR + RADIUS_X_PADDING
  );

  return {
    count: tag.count,
    positionX: INITIAL_POSITION,
    positionY: INITIAL_POSITION,
    radiusX,
    radiusY: BUBBLE_CONFIG.baseRadiusY,
    tag: tag.tag,
  };
};

/** タグデータからバブル配列を生成（件数の多い順にソート） */
export const createBubbles = (tags: TagCount[]): TagBubble[] =>
  [...tags].sort((first, second) => second.count - first.count).map(createBubbleFromTag);

/** グリッドの行列数を計算 */
const calculateGridDimensions = (
  bubbleCount: number
): { cols: number; rows: number; centerRow: number; centerCol: number } => {
  const cols = Math.ceil(Math.sqrt(bubbleCount * GRID_MULTIPLIER));
  const rows = Math.ceil(bubbleCount / cols);
  const centerRow = Math.floor(rows / HALF_DIVISOR);
  const centerCol = Math.floor(cols / HALF_DIVISOR);
  return { centerCol, centerRow, cols, rows };
};

/** 位置リスト作成用パラメータ */
interface SortedPositionsParams {
  rows: number;
  cols: number;
  centerRow: number;
  centerCol: number;
}

/** 中心からの距離でソートした位置リストを作成 */
const createSortedPositions = (
  params: SortedPositionsParams
): { row: number; col: number; dist: number }[] => {
  const { rows, cols, centerRow, centerCol } = params;
  const positions: { row: number; col: number; dist: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        col,
        dist: Math.sqrt((row - centerRow) ** POWER_EXPONENT + (col - centerCol) ** POWER_EXPONENT),
        row,
      });
    }
  }
  positions.sort((first, second) => first.dist - second.dist);
  return positions;
};

/** セルサイズを計算 */
const calculateCellSize = (bubbles: TagBubble[]): { cellWidth: number; cellHeight: number } => {
  const avgRadiusX =
    bubbles.reduce((sum, bubble) => sum + bubble.radiusX, REDUCE_INITIAL) / bubbles.length;
  const cellWidth = avgRadiusX * GRID_MULTIPLIER + BUBBLE_CONFIG.paddingX;
  const cellHeight = BUBBLE_CONFIG.baseRadiusY * GRID_MULTIPLIER + BUBBLE_CONFIG.paddingY;
  return { cellHeight, cellWidth };
};

/** バブル配置用パラメータ */
interface PlaceBubblesParams {
  bubbles: TagBubble[];
  positions: { row: number; col: number; dist: number }[];
  cellWidth: number;
  cellHeight: number;
}

/** バブルを配置（奇数行は半セル分ずらしてハニカム状に） */
const placeBubbles = (params: PlaceBubblesParams): void => {
  const { bubbles, positions, cellWidth, cellHeight } = params;
  for (let index = 0; index < bubbles.length && index < positions.length; index++) {
    const pos = positions[index];
    let offsetForRow = 0;
    if (pos.row % HALF_DIVISOR === ODD_ROW_REMAINDER) {
      offsetForRow = cellWidth / HALF_DIVISOR;
    }
    bubbles[index].positionX = pos.col * cellWidth + offsetForRow;
    bubbles[index].positionY = pos.row * cellHeight;
  }
};

/** バブルをハニカム状に配置し、グリッドサイズを返す */
export const layoutBubbles = (
  bubbles: TagBubble[]
): {
  gridWidth: number;
  gridHeight: number;
} => {
  const { cols, rows, centerRow, centerCol } = calculateGridDimensions(bubbles.length);
  const positions = createSortedPositions({ centerCol, centerRow, cols, rows });
  const { cellWidth, cellHeight } = calculateCellSize(bubbles);
  placeBubbles({ bubbles, cellHeight, cellWidth, positions });

  return { gridHeight: rows * cellHeight, gridWidth: cols * cellWidth };
};

/** バブル探索用のパラメータ */
interface FindBubbleParams {
  clientX: number;
  clientY: number;
  canvas: HTMLCanvasElement;
  state: BubbleState;
}

/** タイル範囲を計算 */
const calculateTileRange = (
  state: BubbleState
): { tilesX: number; tilesY: number; startTileX: number; startTileY: number } => ({
  startTileX: Math.floor(-state.offsetX / state.gridWidth),
  startTileY: Math.floor(-state.offsetY / state.gridHeight),
  tilesX: Math.ceil(state.width / state.gridWidth) + TILE_OFFSET,
  tilesY: Math.ceil(state.height / state.gridHeight) + TILE_OFFSET,
});

/** ヒット判定用パラメータ */
interface CheckHitParams {
  bubble: TagBubble;
  adjustedX: number;
  adjustedY: number;
  tileOffsetX: number;
  tileOffsetY: number;
  state: BubbleState;
}

/** バブルのヒット判定 */
const checkBubbleHit = (params: CheckHitParams): boolean => {
  const { bubble, adjustedX, adjustedY, tileOffsetX, tileOffsetY, state } = params;
  const scale = getScaleAt({
    bubbleX: bubble.positionX,
    bubbleY: bubble.positionY,
    state,
    tileOffsetX,
    tileOffsetY,
  });
  const radiusX = bubble.radiusX * scale;
  const radiusY = bubble.radiusY * scale;
  return (
    Math.abs(adjustedX - (bubble.positionX + tileOffsetX)) <= radiusX &&
    Math.abs(adjustedY - (bubble.positionY + tileOffsetY)) <= radiusY
  );
};

/** 調整済み座標計算用パラメータ */
interface AdjustedCoordsParams {
  clientX: number;
  clientY: number;
  canvas: HTMLCanvasElement;
  state: BubbleState;
}

/** 調整済み座標を計算 */
const calculateAdjustedCoords = (
  params: AdjustedCoordsParams
): { adjustedX: number; adjustedY: number } => {
  const { clientX, clientY, canvas, state } = params;
  const rect = canvas.getBoundingClientRect();
  return {
    adjustedX: clientX - rect.left - state.offsetX,
    adjustedY: clientY - rect.top - state.offsetY,
  };
};

/** タイル内検索用パラメータ */
interface FindInTileParams {
  bubbles: TagBubble[];
  adjustedX: number;
  adjustedY: number;
  tileOffsetX: number;
  tileOffsetY: number;
  state: BubbleState;
}

/** タイル内のバブルを検索 */
const findBubbleInTile = (params: FindInTileParams): TagBubble | null => {
  const { bubbles, adjustedX, adjustedY, tileOffsetX, tileOffsetY, state } = params;
  for (const bubble of bubbles) {
    if (checkBubbleHit({ adjustedX, adjustedY, bubble, state, tileOffsetX, tileOffsetY })) {
      return bubble;
    }
  }
  return null;
};

/** 全タイルを走査してバブルを検索 */
const searchBubblesInTiles = (
  state: BubbleState,
  adjustedX: number,
  adjustedY: number
): TagBubble | null => {
  const { tilesX, tilesY, startTileX, startTileY } = calculateTileRange(state);
  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const tileOffsetX = (startTileX + tx) * state.gridWidth;
      const tileOffsetY = (startTileY + ty) * state.gridHeight;
      const found = findBubbleInTile({
        adjustedX,
        adjustedY,
        bubbles: state.bubbles,
        state,
        tileOffsetX,
        tileOffsetY,
      });
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/** 指定座標にあるバブルを探す（無限ループ対応） */
export const findBubbleAtPosition = (params: FindBubbleParams): TagBubble | null => {
  const { clientX, clientY, canvas, state } = params;
  const { adjustedX, adjustedY } = calculateAdjustedCoords({ canvas, clientX, clientY, state });
  return searchBubblesInTiles(state, adjustedX, adjustedY);
};
