import type { MdxTableProps } from './types';

/* スマホ表示で列数の多い表がビューポート幅を超えないよう、横スクロール可能なコンテナで囲む */
export const MdxTable = (props: MdxTableProps) => (
  <div className="w-full overflow-x-auto">
    <table {...props} />
  </div>
);
