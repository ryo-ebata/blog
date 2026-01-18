'use client';

import { type BubbleState, type BubbleTagFilterProps, createInitialState } from './types';
import { createBubbles, layoutBubbles } from './bubbles';
import { INTERPOLATION_FACTOR, MAX_CANVAS_SIZE } from './constants';
import { drawAllBubbles, drawBackground, drawVignette } from './drawing';
import { createPointerHandlers, useDarkMode } from './hooks';
import { useCallback, useMemo, useRef } from 'react';

/* マジックナンバー定数 */
const EMPTY_LENGTH = 0;
const INITIAL_ANIMATION_REF = 0;
const GRID_MULTIPLIER = 2;
const FALLBACK_DPR = 1;
const FALLBACK_COL_ROW = 1;
const HALF_DIVISOR = 2;
const CLEAR_RECT_START = 0;
const FIRST_TOUCH_INDEX = 0;

/** オフセット初期化用パラメータ */
interface InitializeOffsetsParams {
  state: BubbleState;
  gridWidth: number;
  gridHeight: number;
  tagCount: number;
}

/** 状態の初期化を行う */
const initializeOffsets = (params: InitializeOffsetsParams): void => {
  const { state, gridWidth, gridHeight, tagCount } = params;
  const cols = Math.ceil(Math.sqrt(tagCount * GRID_MULTIPLIER)) || FALLBACK_COL_ROW;
  const rows = Math.ceil(tagCount / cols) || FALLBACK_COL_ROW;
  state.baseOffsetX = (state.width - gridWidth) / HALF_DIVISOR + gridWidth / cols / HALF_DIVISOR;
  state.baseOffsetY = (state.height - gridHeight) / HALF_DIVISOR + gridHeight / rows / HALF_DIVISOR;
  setInitialOffsetsIfNeeded(state);
};

/** 初回のみオフセットを初期化 */
const setInitialOffsetsIfNeeded = (state: BubbleState): void => {
  if (!state.initialized) {
    state.offsetX = state.baseOffsetX;
    state.targetOffsetX = state.baseOffsetX;
    state.offsetY = state.baseOffsetY;
    state.targetOffsetY = state.baseOffsetY;
    state.initialized = true;
  }
};

/** オフセットの補間処理 */
const interpolateOffsets = (state: BubbleState): void => {
  state.offsetX += (state.targetOffsetX - state.offsetX) * INTERPOLATION_FACTOR;
  state.offsetY += (state.targetOffsetY - state.offsetY) * INTERPOLATION_FACTOR;
};

/** キャンバスの状態を更新 */
const updateCanvasState = (state: BubbleState, size: number): void => {
  state.width = size;
  state.height = size;
  state.centerX = size / HALF_DIVISOR;
  state.centerY = size / HALF_DIVISOR;
};

/** キャンバスのサイズを設定 */
const setCanvasSize = (canvas: HTMLCanvasElement, size: number, dpr: number): void => {
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
};

/** ResizeObserverのクリーンアップ */
const cleanupResizeObserver = (
  resizeObserverRef: React.MutableRefObject<ResizeObserver | null>,
  animationRef: React.MutableRefObject<number>
): void => {
  resizeObserverRef.current?.disconnect();
  resizeObserverRef.current = null;
  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = INITIAL_ANIMATION_REF;
  }
};

/** 描画コンテキストの初期化 */
const initDrawContext = (
  canvas: HTMLCanvasElement,
  dpr: number
): CanvasRenderingContext2D | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  ctx.clearRect(CLEAR_RECT_START, CLEAR_RECT_START, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(dpr, dpr);
  return ctx;
};

/** メイン描画パラメータ */
interface RenderMainParams {
  ctx: CanvasRenderingContext2D;
  state: BubbleState;
  selectedTags: string[];
  isDarkMode: boolean;
}

/** メイン描画処理 */
const renderMainContent = (params: RenderMainParams): void => {
  const { ctx, state, selectedTags, isDarkMode } = params;
  drawBackground(ctx, state, isDarkMode);
  ctx.translate(state.offsetX, state.offsetY);
  drawAllBubbles({ ctx, isDarkMode, selectedTags, state });
  ctx.restore();
};

/** ビネット描画パラメータ */
interface RenderVignetteParams {
  ctx: CanvasRenderingContext2D;
  state: BubbleState;
  dpr: number;
  isDarkMode: boolean;
}

/** ビネット描画処理 */
const renderVignette = (params: RenderVignetteParams): void => {
  const { ctx, state, dpr, isDarkMode } = params;
  ctx.save();
  ctx.scale(dpr, dpr);
  drawVignette(ctx, state, isDarkMode);
  ctx.restore();
};

/** 描画実行パラメータ */
interface ExecuteDrawingParams {
  canvas: HTMLCanvasElement;
  state: BubbleState;
  selectedTags: string[];
  isDarkMode: boolean;
}

/** 描画処理のメイン */
const executeDrawing = (params: ExecuteDrawingParams): void => {
  const { canvas, state, selectedTags, isDarkMode } = params;
  const dpr = window.devicePixelRatio || FALLBACK_DPR;
  interpolateOffsets(state);
  const ctx = initDrawContext(canvas, dpr);
  if (!ctx) {
    return;
  }
  renderMainContent({ ctx, isDarkMode, selectedTags, state });
  renderVignette({ ctx, dpr, isDarkMode, state });
};

/** Canvasのレンダリング */
const CanvasElement = ({
  canvasRef,
  pointerHandlers,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pointerHandlers: ReturnType<typeof createPointerHandlers>;
}) => (
  <canvas
    ref={canvasRef}
    className="cursor-grab active:cursor-grabbing touch-none"
    onMouseDown={(ev) => pointerHandlers.onPointerDown(ev.clientX, ev.clientY)}
    onMouseMove={(ev) => pointerHandlers.onPointerMove(ev.clientX, ev.clientY)}
    onMouseUp={(ev) => pointerHandlers.onPointerUp(ev.clientX, ev.clientY)}
    onMouseLeave={() => pointerHandlers.onPointerLeave()}
    onTouchStart={(ev) =>
      pointerHandlers.onPointerDown(
        ev.touches[FIRST_TOUCH_INDEX].clientX,
        ev.touches[FIRST_TOUCH_INDEX].clientY
      )
    }
    onTouchMove={(ev) =>
      pointerHandlers.onPointerMove(
        ev.touches[FIRST_TOUCH_INDEX].clientX,
        ev.touches[FIRST_TOUCH_INDEX].clientY
      )
    }
    onTouchEnd={(ev) =>
      pointerHandlers.onPointerUp(
        ev.changedTouches[FIRST_TOUCH_INDEX].clientX,
        ev.changedTouches[FIRST_TOUCH_INDEX].clientY
      )
    }
  />
);

/** UseRefの初期化をまとめる */
const useCanvasRefs = () => ({
  animationRef: useRef(INITIAL_ANIMATION_REF),
  canvasRef: useRef<HTMLCanvasElement>(null),
  resizeObserverRef: useRef<ResizeObserver | null>(null),
  stateRef: useRef(createInitialState()),
});

/** バブル初期化フック */
const useInitBubbles = (
  tags: BubbleTagFilterProps['tags'],
  stateRef: React.RefObject<BubbleState>
) =>
  useCallback(() => {
    if (tags.length === EMPTY_LENGTH) {
      return;
    }
    const state = stateRef.current;
    state.bubbles = createBubbles(tags);
    const { gridWidth, gridHeight } = layoutBubbles(state.bubbles);
    state.gridWidth = gridWidth;
    state.gridHeight = gridHeight;
    initializeOffsets({ gridHeight, gridWidth, state, tagCount: tags.length });
  }, [tags, stateRef]);

/** 描画フックパラメータ */
interface UseDrawParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  stateRef: React.RefObject<BubbleState>;
  selectedTags: string[];
  isDarkMode: boolean;
}

/** 描画フック */
const useDraw = (params: UseDrawParams) => {
  const { canvasRef, stateRef, selectedTags, isDarkMode } = params;
  return useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    executeDrawing({ canvas, isDarkMode, selectedTags, state: stateRef.current });
  }, [isDarkMode, selectedTags, canvasRef, stateRef]);
};

/** サイズ更新フック */
const useUpdateSize = (
  stateRef: React.RefObject<BubbleState>,
  initBubbles: () => void,
  draw: () => void
) =>
  useCallback(
    (container: Element, canvas: HTMLCanvasElement) => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || FALLBACK_DPR;
      const size = Math.min(rect.width, MAX_CANVAS_SIZE);
      updateCanvasState(stateRef.current, size);
      setCanvasSize(canvas, size, dpr);
      initBubbles();
      draw();
    },
    [initBubbles, draw, stateRef]
  );

/** Refs型定義 */
type CanvasRefs = ReturnType<typeof useCanvasRefs>;

/** アニメーションとコンテナコールバックフック */
const useAnimationAndContainer = (
  refs: CanvasRefs,
  draw: () => void,
  updateSize: (container: Element, canvas: HTMLCanvasElement) => void
) => {
  const animate = useCallback(() => {
    draw();
    refs.animationRef.current = requestAnimationFrame(animate);
  }, [draw, refs.animationRef]);

  const containerRefCallback = useCallback(
    (container: HTMLDivElement | null) => {
      cleanupResizeObserver(refs.resizeObserverRef, refs.animationRef);
      if (!container || !refs.canvasRef.current) {
        return;
      }
      const canvas = refs.canvasRef.current;
      updateSize(container, canvas);
      animate();
      refs.resizeObserverRef.current = new ResizeObserver(() => updateSize(container, canvas));
      refs.resizeObserverRef.current.observe(container);
    },
    [updateSize, animate, refs]
  );

  return containerRefCallback;
};

/**
 * バブル型のタグフィルター
 */
export const BubbleTagFilter = ({ tags, selectedTags, onTagToggle }: BubbleTagFilterProps) => {
  const refs = useCanvasRefs();
  const isDarkMode = useDarkMode();
  const pointerHandlers = useMemo(
    () => createPointerHandlers(refs.stateRef, refs.canvasRef, onTagToggle),
    [onTagToggle, refs.stateRef, refs.canvasRef]
  );
  const initBubbles = useInitBubbles(tags, refs.stateRef);
  const draw = useDraw({
    canvasRef: refs.canvasRef,
    isDarkMode,
    selectedTags,
    stateRef: refs.stateRef,
  });
  const updateSize = useUpdateSize(refs.stateRef, initBubbles, draw);
  const containerRefCallback = useAnimationAndContainer(refs, draw, updateSize);

  if (tags.length === EMPTY_LENGTH) {
    return null;
  }

  return (
    <div
      ref={containerRefCallback}
      className="w-full flex justify-center overflow-hidden rounded-lg"
    >
      <CanvasElement canvasRef={refs.canvasRef} pointerHandlers={pointerHandlers} />
    </div>
  );
};
