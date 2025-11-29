import { Container } from '@/components/composites/container';
import { BackLink } from '@/components/elements';
import { MdxHeading } from '@/components/mdx/heading/heading';

export default function NotFound() {
  return (
    <Container maxWidth="2xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <MdxHeading as="h1">404</MdxHeading>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-mono">$ cat: page not found</p>
        <p className="text-gray-600 dark:text-gray-300 font-mono">ページが見つかりませんでした。</p>
        <BackLink href="/" label="$ cd ~ # ホームに戻る" />
      </div>
    </Container>
  );
}
