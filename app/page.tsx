import { HomeContainer } from './container';

export const revalidate = 3600; // 1時間ごとに再検証

export default async function Home() {
  return <HomeContainer />;
}
