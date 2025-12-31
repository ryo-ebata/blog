import type { TagCount } from '@/lib/tags';

/** コンポーネントのProps */
export interface BubbleTagFilterProps {
  tags: TagCount[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

/** 個々のバブル（タグ）の情報 */
export interface TagBubble {
  x: number;
  y: number;
  tag: string;
  count: number;
  radiusX: number;
  radiusY: number;
}

/** ドラッグ操作の状態 */
export interface DragState {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  totalDragMove: number;
}

/** キャンバスの状態 */
export interface CanvasState {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  /** 現在のオフセット（アニメーション中） */
  offsetX: number;
  offsetY: number;
  /** 目標オフセット（ドラッグ先） */
  targetOffsetX: number;
  targetOffsetY: number;
  /** 初期オフセット */
  baseOffsetX: number;
  baseOffsetY: number;
}

/** グリッドの状態 */
export interface GridState {
  bubbles: TagBubble[];
  gridWidth: number;
  gridHeight: number;
  initialized: boolean;
}

/** バブルフィルターの全状態 */
export type BubbleState = DragState & CanvasState & GridState;

/** バブル設定 */
export interface BubbleConfig {
  scaleFactor: number;
  baseRadiusY: number;
  charWidth: number;
  paddingX: number;
  paddingY: number;
}

/** 初期状態を生成 */
export function createInitialState(): BubbleState {
  return {
    // ドラッグ状態
    isDragging: false,
    lastX: 0,
    lastY: 0,
    totalDragMove: 0,
    // キャンバス状態
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    offsetX: 0,
    offsetY: 0,
    targetOffsetX: 0,
    targetOffsetY: 0,
    baseOffsetX: 0,
    baseOffsetY: 0,
    // グリッド状態
    bubbles: [],
    gridWidth: 0,
    gridHeight: 0,
    initialized: false,
  };
}
