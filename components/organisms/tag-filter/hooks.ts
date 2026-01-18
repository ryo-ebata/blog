import type { BubbleState } from './types';

import { type RefObject, useSyncExternalStore } from 'react';
import { findBubbleAtPosition } from './bubbles';
import { CLICK_THRESHOLD } from './constants';

/*
 * ========================================
 * ダークモード監視フック
 * ========================================
 */

const subscribeToDarkMode = (callback: () => void): (() => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributeFilter: ['class'], attributes: true });
  return () => observer.disconnect();
};

const getDarkModeSnapshot = (): boolean => document.documentElement.classList.contains('dark');
const getDarkModeServerSnapshot = (): boolean => false;

/** ダークモードの状態を監視 */
export const useDarkMode = (): boolean =>
  useSyncExternalStore(subscribeToDarkMode, getDarkModeSnapshot, getDarkModeServerSnapshot);

/*
 * ========================================
 * ポインターハンドラ
 * ========================================
 */

const INITIAL_DRAG_MOVE = 0;

export interface PointerHandlers {
  onPointerDown: (clientX: number, clientY: number) => void;
  onPointerMove: (clientX: number, clientY: number) => void;
  onPointerUp: (clientX: number, clientY: number) => void;
  onPointerLeave: () => void;
}

/** ドラッグ開始 */
const handlePointerDown = (state: BubbleState, clientX: number, clientY: number): void => {
  state.isDragging = true;
  state.lastX = clientX;
  state.lastY = clientY;
  state.totalDragMove = INITIAL_DRAG_MOVE;
};

/** ドラッグ中 */
const handlePointerMove = (state: BubbleState, clientX: number, clientY: number): void => {
  if (!state.isDragging) {
    return;
  }

  const deltaX = clientX - state.lastX;
  const deltaY = clientY - state.lastY;
  state.totalDragMove += Math.abs(deltaX) + Math.abs(deltaY);
  state.targetOffsetX += deltaX;
  state.targetOffsetY += deltaY;
  state.lastX = clientX;
  state.lastY = clientY;
};

/** ポインターアップのパラメータ */
interface PointerUpParams {
  state: BubbleState;
  clientX: number;
  clientY: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onTagToggle: (tag: string) => void;
}

/** ドラッグ終了（クリック判定込み） */
const handlePointerUp = (params: PointerUpParams): void => {
  const { state, clientX, clientY, canvasRef, onTagToggle } = params;
  state.isDragging = false;

  /* 移動量が少なければクリックとみなす */
  if (state.totalDragMove < CLICK_THRESHOLD && canvasRef.current) {
    const bubble = findBubbleAtPosition({
      canvas: canvasRef.current,
      clientX,
      clientY,
      state,
    });
    if (bubble) {
      onTagToggle(bubble.tag);
    }
  }
};

/** ポインターハンドラを生成 */
export const createPointerHandlers = (
  stateRef: RefObject<BubbleState>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onTagToggle: (tag: string) => void
): PointerHandlers => ({
  onPointerDown: (clientX, clientY) => handlePointerDown(stateRef.current, clientX, clientY),
  onPointerLeave: () => {
    stateRef.current.isDragging = false;
  },
  onPointerMove: (clientX, clientY) => handlePointerMove(stateRef.current, clientX, clientY),
  onPointerUp: (clientX, clientY) =>
    handlePointerUp({
      canvasRef,
      clientX,
      clientY,
      onTagToggle,
      state: stateRef.current,
    }),
});
