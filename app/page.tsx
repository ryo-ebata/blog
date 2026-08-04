import { JsonLd } from '@/components/jsonld/jsonld';
import { siteConfig } from '@/config/site';
import { generateWebSiteJsonLd } from '@/lib/jsonld';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { HomeContainer } from './container';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = generatePageMetadata({
  description: siteConfig.description,
  title: siteConfig.name,
  url: siteConfig.url,
});

const Home = () => {
  const webSiteJsonLd = generateWebSiteJsonLd();

  return (
    <>
      <JsonLd data={webSiteJsonLd} />
      <HomeContainer />
    </>
  );
};

export default Home;
