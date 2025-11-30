import { JsonLd } from '@/components/jsonld/jsonld';
import { siteConfig } from '@/config/site';
import { generateWebSiteJsonLd } from '@/lib/jsonld';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { HomeContainer } from './container';

export const revalidate = 3600; // 1時間ごとに再検証

export const metadata = generatePageMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
});

export default async function Home() {
  const webSiteJsonLd = generateWebSiteJsonLd();

  return (
    <>
      <JsonLd data={webSiteJsonLd} />
      <HomeContainer />
    </>
  );
}
