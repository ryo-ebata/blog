import { JsonLd } from '@/components/jsonld/jsonld';
import { siteConfig } from '@/config/site';
import { generateWebSiteJsonLd } from '@/lib/jsonld';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { HomeContainer } from './container';

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
