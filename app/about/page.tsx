import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { AboutContainer } from './container';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

/* TODO: cacheComponents下ではrevalidateエクスポートは非互換のため一時的に無効化。
   Phase 2/3で 'use cache' + cacheLife('hours') に置き換える。 */

export const metadata = generatePageMetadata({
  description: `${siteConfig.name}について`,
  title: 'About',
  url: `${siteConfig.url}/about`,
});

const AboutPage = () => <AboutContainer />;

export default AboutPage;
