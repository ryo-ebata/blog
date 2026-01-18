import type { TagCount } from '@/lib/tags';

/** コンポーネントのProps */
export interface BubbleTagFilterProps {
  tags: TagCount[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

/** 個々のバブル（タグ）の情報 */
export interface TagBubble {
  count: number;
  positionX: number;
  positionY: number;
  radiusX: number;
  radiusY: number;
  tag: string;
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

/* 初期状態の定数 */
const INITIAL_VALUE = 0;

/** 初期状態を生成 */
export const createInitialState = (): BubbleState => ({
  baseOffsetX: INITIAL_VALUE,
  baseOffsetY: INITIAL_VALUE,
  bubbles: [],
  centerX: INITIAL_VALUE,
  centerY: INITIAL_VALUE,
  gridHeight: INITIAL_VALUE,
  gridWidth: INITIAL_VALUE,
  height: INITIAL_VALUE,
  initialized: false,
  isDragging: false,
  lastX: INITIAL_VALUE,
  lastY: INITIAL_VALUE,
  offsetX: INITIAL_VALUE,
  offsetY: INITIAL_VALUE,
  targetOffsetX: INITIAL_VALUE,
  targetOffsetY: INITIAL_VALUE,
  totalDragMove: INITIAL_VALUE,
  width: INITIAL_VALUE,
});
