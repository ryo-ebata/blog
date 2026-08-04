import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { AboutContainer } from './container';

export const metadata = generatePageMetadata({
  description: `${siteConfig.name}について`,
  title: 'About',
  url: `${siteConfig.url}/about`,
});

const AboutPage = () => <AboutContainer />;

export default AboutPage;
