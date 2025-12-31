import type { RefObject } from 'react';
import { useSyncExternalStore } from 'react';
import { findBubbleAtPosition } from './bubbles';
import { CLICK_THRESHOLD } from './constants';
import type { BubbleState } from './types';

// ========================================
// ダークモード監視フック
// ========================================

function subscribeToDarkMode(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

const getDarkModeSnapshot = () => document.documentElement.classList.contains('dark');
const getDarkModeServerSnapshot = () => false;

/** ダークモードの状態を監視 */
export function useDarkMode(): boolean {
  return useSyncExternalStore(subscribeToDarkMode, getDarkModeSnapshot, getDarkModeServerSnapshot);
}

// ========================================
// ポインターハンドラ
// ========================================

export interface PointerHandlers {
  onPointerDown: (clientX: number, clientY: number) => void;
  onPointerMove: (clientX: number, clientY: number) => void;
  onPointerUp: (clientX: number, clientY: number) => void;
  onPointerLeave: () => void;
}

/** ドラッグ開始 */
function handlePointerDown(state: BubbleState, clientX: number, clientY: number): void {
  state.isDragging = true;
  state.lastX = clientX;
  state.lastY = clientY;
  state.totalDragMove = 0;
}

/** ドラッグ中 */
function handlePointerMove(state: BubbleState, clientX: number, clientY: number): void {
  if (!state.isDragging) return;

  const deltaX = clientX - state.lastX;
  const deltaY = clientY - state.lastY;
  state.totalDragMove += Math.abs(deltaX) + Math.abs(deltaY);
  state.targetOffsetX += deltaX;
  state.targetOffsetY += deltaY;
  state.lastX = clientX;
  state.lastY = clientY;
}

/** ドラッグ終了（クリック判定込み） */
function handlePointerUp(
  state: BubbleState,
  clientX: number,
  clientY: number,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onTagToggle: (tag: string) => void
): void {
  state.isDragging = false;

  // 移動量が少なければクリックとみなす
  if (state.totalDragMove < CLICK_THRESHOLD && canvasRef.current) {
    const bubble = findBubbleAtPosition(clientX, clientY, canvasRef.current, state);
    if (bubble) onTagToggle(bubble.tag);
  }
}

/** ポインターハンドラを生成 */
export function createPointerHandlers(
  stateRef: RefObject<BubbleState>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onTagToggle: (tag: string) => void
): PointerHandlers {
  return {
    onPointerDown: (x, y) => handlePointerDown(stateRef.current, x, y),
    onPointerMove: (x, y) => handlePointerMove(stateRef.current, x, y),
    onPointerUp: (x, y) => handlePointerUp(stateRef.current, x, y, canvasRef, onTagToggle),
    onPointerLeave: () => {
      stateRef.current.isDragging = false;
    },
  };
}
