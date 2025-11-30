import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { AboutContainer } from './container';

export const revalidate = 3600; // 1時間ごとに再検証

export const metadata = generatePageMetadata({
  title: 'About',
  description: `${siteConfig.name}について`,
  url: `${siteConfig.url}/about`,
});

export default async function AboutPage() {
  return <AboutContainer />;
}
