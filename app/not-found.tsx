import { BackLink } from '@/components/atoms';
import { Container } from '@/components/organisms';

export default function NotFound() {
  return (
    <Container maxWidth="2xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="font-bold scroll-m-20 text-6xl text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">ページが見つかりません</p>
        <p className="text-muted-foreground">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <BackLink href="/" label="ホームに戻る" />
      </div>
    </Container>
  );
}
