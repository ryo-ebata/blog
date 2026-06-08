import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const loadOgFont = async (): Promise<ArrayBuffer> => {
  const fontPath = join(process.cwd(), 'assets/fonts/NotoSansJP-Bold.woff2');
  const buffer = await readFile(fontPath);
  return new Uint8Array(buffer).buffer;
};
