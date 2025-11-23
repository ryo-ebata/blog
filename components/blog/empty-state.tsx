export function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-gray-600 text-lg">まだ記事がありません。</p>
      <p className="text-gray-500 mt-2 text-sm">
        posts/ ディレクトリにMarkdownファイルを追加してください。
      </p>
    </div>
  );
}
