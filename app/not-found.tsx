import { Link } from 'next-view-transitions';

import { buttonVariants } from '@/components/atoms/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/atoms';
import { Container } from '@/components/organisms';

export default function NotFound() {
  return (
    <Container maxWidth="2xl">
      <Empty className="min-h-[60vh]">
        <EmptyHeader>
          <p className="text-6xl font-bold tracking-tight text-foreground">404</p>
          <EmptyTitle className="text-xl text-muted-foreground">ページが見つかりません</EmptyTitle>
          <EmptyDescription>
            お探しのページは存在しないか、移動した可能性があります。
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants()}>
            ホームに戻る
          </Link>
        </EmptyContent>
      </Empty>
    </Container>
  );
}
