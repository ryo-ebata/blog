const FIRST_CAPTURE_GROUP = 1;

export interface ParsedMeta {
  highlightLines: number[];
  showLineNumbers: boolean;
  title?: string;
}

const parseTitle = (meta: string): string | undefined => {
  const match = meta.match(/title=["']([^"']+)["']/);
  return match?.[FIRST_CAPTURE_GROUP];
};

const expandRange = (start: number, end: number): number[] => {
  const result: number[] = [];
  for (let idx = start; idx <= end; idx++) {
    result.push(idx);
  }
  return result;
};

const parseRangeItem = (range: string): number[] => {
  if (range.includes('-')) {
    const [start, end] = range.split('-').map(Number);
    return expandRange(start, end);
  }
  return [Number(range)];
};

const parseHighlightLines = (meta: string): number[] => {
  const match = meta.match(/\{([^}]+)\}/);
  if (!match) {
    return [];
  }
  const ranges = match[FIRST_CAPTURE_GROUP].split(',');
  return ranges.flatMap(parseRangeItem);
};

export const parseMeta = (meta: string | undefined): ParsedMeta => {
  if (!meta) {
    return {
      highlightLines: [],
      showLineNumbers: false,
      title: undefined,
    };
  }

  return {
    highlightLines: parseHighlightLines(meta),
    showLineNumbers: meta.includes('showLineNumbers'),
    title: parseTitle(meta),
  };
};
