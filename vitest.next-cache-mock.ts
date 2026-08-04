/* next/cacheのcacheLife/cacheTag/revalidateTag等はNext.jsのServer Component/
   Route Handlerレンダリング文脈でのみ動作するため、vitest実行時はno-opにする
   ('use cache'関数自体はテスト対象コードをそのまま実行できる) */
export const cacheLife = (): void => {};
export const cacheTag = (): void => {};
export const revalidatePath = (): void => {};
export const revalidateTag = (): void => {};
