import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { HomeContainer } from './container';

export const revalidate = 3600; // 1時間ごとに再検証

export const metadata = generatePageMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
});

export default async function Home() {
  return <HomeContainer />;
}
