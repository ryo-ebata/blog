import { Badge } from '@/components/atoms/badge';
import { cn } from '@/lib/utils';

/**
 * アフィリエイト/広告の読者向け開示ラベル(景表法ステマ規制・ASP規約対応)。
 * rel="sponsored"(検索エンジン向け)とは別に、人間が読める明示開示を担う。
 */
export const AffiliateDisclosure = ({ className }: { className?: string }) => (
  <p className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
    <Badge variant="outline">PR</Badge>
    広告（アフィリエイトリンク）を含みます
  </p>
);
