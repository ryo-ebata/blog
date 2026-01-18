import type { TagCount } from '@/lib/tags';
import { BUBBLE_CONFIG } from './constants';
import { getScaleAt } from './drawing';
import type { BubbleState, TagBubble } from './types';

/** タグデータからバブル配列を生成（件数の多い順にソート） */
export function createBubbles(tags: TagCount[]): TagBubble[] {
  return [...tags]
    .sort((a, b) => b.count - a.count)
    .map((tag) => {
      // 横幅はテキスト長に応じて動的に決定
      const textLength = tag.tag.length + String(tag.count).length + 1;
      const radiusX = Math.max(25, (textLength * BUBBLE_CONFIG.charWidth) / 2 + 12);

      return {
        count: tag.count,
        radiusX,
        radiusY: BUBBLE_CONFIG.baseRadiusY,
        tag: tag.tag,
        x: 0,
        y: 0,
      };
    });
}

/** バブルをハニカム状に配置し、グリッドサイズを返す */
export function layoutBubbles(bubbles: TagBubble[]): { gridWidth: number; gridHeight: number } {
  // グリッドの行列数を計算
  const cols = Math.ceil(Math.sqrt(bubbles.length * 2));
  const rows = Math.ceil(bubbles.length / cols);
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);

  // 中心からの距離でソートした位置リストを作成
  const positions: { row: number; col: number; dist: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        col,
        dist: Math.sqrt((row - centerRow) ** 2 + (col - centerCol) ** 2),
        row,
      });
    }
  }
  positions.sort((a, b) => a.dist - b.dist);

  // セルサイズを計算
  const avgRadiusX = bubbles.reduce((sum, b) => sum + b.radiusX, 0) / bubbles.length;
  const cellWidth = avgRadiusX * 2 + BUBBLE_CONFIG.paddingX;
  const cellHeight = BUBBLE_CONFIG.baseRadiusY * 2 + BUBBLE_CONFIG.paddingY;

  // バブルを配置（奇数行は半セル分ずらしてハニカム状に）
  for (let i = 0; i < bubbles.length && i < positions.length; i++) {
    const pos = positions[i];
    const offsetForRow = pos.row % 2 === 1 ? cellWidth / 2 : 0;
    bubbles[i].x = pos.col * cellWidth + offsetForRow;
    bubbles[i].y = pos.row * cellHeight;
  }

  return { gridHeight: rows * cellHeight, gridWidth: cols * cellWidth };
}

/** 指定座標にあるバブルを探す（無限ループ対応） */
export function findBubbleAtPosition(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  state: BubbleState
): TagBubble | null {
  const rect = canvas.getBoundingClientRect();
  const adjustedX = clientX - rect.left - state.offsetX;
  const adjustedY = clientY - rect.top - state.offsetY;

  // 表示中のタイル範囲を計算
  const tilesX = Math.ceil(state.width / state.gridWidth) + 1;
  const tilesY = Math.ceil(state.height / state.gridHeight) + 1;
  const startTileX = Math.floor(-state.offsetX / state.gridWidth);
  const startTileY = Math.floor(-state.offsetY / state.gridHeight);

  // 全タイルを走査してヒット判定
  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const tileOffsetX = (startTileX + tx) * state.gridWidth;
      const tileOffsetY = (startTileY + ty) * state.gridHeight;

      for (const bubble of state.bubbles) {
        const scale = getScaleAt(bubble.x, bubble.y, tileOffsetX, tileOffsetY, state);
        const radiusX = bubble.radiusX * scale;
        const radiusY = bubble.radiusY * scale;

        const isHit =
          Math.abs(adjustedX - (bubble.x + tileOffsetX)) <= radiusX &&
          Math.abs(adjustedY - (bubble.y + tileOffsetY)) <= radiusY;

        if (isHit) {return bubble;}
      }
    }
  }

  return null;
}
