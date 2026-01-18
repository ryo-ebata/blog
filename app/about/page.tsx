import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { AboutContainer } from './container';

/* 1時間ごとに再検証 */
export const revalidate = 3600;

export const metadata = generatePageMetadata({
  description: `${siteConfig.name}について`,
  title: 'About',
  url: `${siteConfig.url}/about`,
});

const AboutPage = () => <AboutContainer />;

export default AboutPage;
