type PostContentProps = {
  html: string;
};

export function PostContent({ html }: PostContentProps) {
  return (
    <div
      className="prose prose-lg max-w-none bg-white rounded-lg p-6 border border-gray-200 shadow-sm prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-pink-600 prose-pre:bg-gray-900 prose-pre:text-gray-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
