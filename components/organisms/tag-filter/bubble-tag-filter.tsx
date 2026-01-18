'use client';

import { useCallback, useMemo, useRef } from 'react';
import { createBubbles, layoutBubbles } from './bubbles';
import { INTERPOLATION_FACTOR, MAX_CANVAS_SIZE } from './constants';
import { drawAllBubbles, drawBackground, drawVignette } from './drawing';
import { createPointerHandlers, useDarkMode } from './hooks';
import { type BubbleTagFilterProps, createInitialState } from './types';

/**
 * バブル型のタグフィルター
 * - 無限スクロール対応
 * - ドラッグで移動、クリックで選択
 */
export function BubbleTagFilter({ tags, selectedTags, onTagToggle }: BubbleTagFilterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(createInitialState());
  const animationRef = useRef(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const isDarkMode = useDarkMode();

  // ポインターハンドラをメモ化
  const pointerHandlers = useMemo(
    () => createPointerHandlers(stateRef, canvasRef, onTagToggle),
    [onTagToggle]
  );

  // バブルを初期化
  const initBubbles = useCallback(() => {
    if (tags.length === 0) {return;}

    const state = stateRef.current;
    state.bubbles = createBubbles(tags);
    const { gridWidth, gridHeight } = layoutBubbles(state.bubbles);

    state.gridWidth = gridWidth;
    state.gridHeight = gridHeight;

    // オフセット計算用のセルサイズ
    const cols = Math.ceil(Math.sqrt(tags.length * 2)) || 1;
    const rows = Math.ceil(tags.length / cols) || 1;
    state.baseOffsetX = (state.width - gridWidth) / 2 + gridWidth / cols / 2;
    state.baseOffsetY = (state.height - gridHeight) / 2 + gridHeight / rows / 2;

    // 初回のみオフセットを初期化
    if (!state.initialized) {
      state.offsetX = state.targetOffsetX = state.baseOffsetX;
      state.offsetY = state.targetOffsetY = state.baseOffsetY;
      state.initialized = true;
    }
  }, [tags]);

  // 描画処理
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {return;}

    const state = stateRef.current;
    const dpr = window.devicePixelRatio || 1;

    // オフセットを滑らかに補間
    state.offsetX += (state.targetOffsetX - state.offsetX) * INTERPOLATION_FACTOR;
    state.offsetY += (state.targetOffsetY - state.offsetY) * INTERPOLATION_FACTOR;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    drawBackground(ctx, state, isDarkMode);
    ctx.translate(state.offsetX, state.offsetY);
    drawAllBubbles(ctx, state, selectedTags, isDarkMode);
    ctx.restore();

    // ビネット効果（最前面に描画）
    ctx.save();
    ctx.scale(dpr, dpr);
    drawVignette(ctx, state, isDarkMode);
    ctx.restore();
  }, [isDarkMode, selectedTags]);

  // サイズ更新
  const updateSize = useCallback(
    (container: Element, canvas: HTMLCanvasElement) => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(rect.width, MAX_CANVAS_SIZE);
      const state = stateRef.current;

      state.width = state.height = size;
      state.centerX = state.centerY = size / 2;

      canvas.width = canvas.height = size * dpr;
      canvas.style.width = canvas.style.height = `${size}px`;

      initBubbles();
      draw();
    },
    [initBubbles, draw]
  );

  // アニメーションループ
  const animate = useCallback(() => {
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

  // コンテナのref callback（初期化・リサイズ監視）
  const containerRefCallback = useCallback(
    (container: HTMLDivElement | null) => {
      // クリーンアップ
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = 0;
      }

      if (!container || !canvasRef.current) {return;}

      // 初期化
      const canvas = canvasRef.current;
      updateSize(container, canvas);
      animate();

      // リサイズ監視
      resizeObserverRef.current = new ResizeObserver(() => updateSize(container, canvas));
      resizeObserverRef.current.observe(container);
    },
    [updateSize, animate]
  );

  if (tags.length === 0) {return null;}

  return (
    <div
      ref={containerRefCallback}
      className="w-full flex justify-center overflow-hidden rounded-lg"
    >
      <canvas
        ref={canvasRef}
        className="cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={(e) => pointerHandlers.onPointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => pointerHandlers.onPointerMove(e.clientX, e.clientY)}
        onMouseUp={(e) => pointerHandlers.onPointerUp(e.clientX, e.clientY)}
        onMouseLeave={pointerHandlers.onPointerLeave}
        onTouchStart={(e) =>
          pointerHandlers.onPointerDown(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchMove={(e) =>
          pointerHandlers.onPointerMove(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchEnd={(e) =>
          pointerHandlers.onPointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }
      />
    </div>
  );
}
