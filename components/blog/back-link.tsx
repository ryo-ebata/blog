import Link from 'next/link';

type BackLinkProps = {
  href?: string;
  label?: string;
};

export function BackLink({ href = '/blog', label = '← ブログ一覧に戻る' }: BackLinkProps) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
      >
        {label}
      </Link>
    </div>
  );
}
