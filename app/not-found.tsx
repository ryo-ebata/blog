import Link from 'next/link';
import { Container } from '@/components/composites/container';

export default function NotFound() {
  return (
    <Container maxWidth="2xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-6xl font-bold font-mono text-terminal-green dark:text-terminal-green terminal-glow">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-mono">$ cat: page not found</p>
        <p className="text-gray-600 dark:text-gray-300 font-mono">ページが見つかりませんでした。</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 font-mono text-terminal-cyan dark:text-terminal-cyan border border-terminal-border hover:bg-terminal-border transition-colors duration-200 terminal-glow"
        >
          $ cd ~ {'# ホームに戻る'}
        </Link>
      </div>
    </Container>
  );
}
