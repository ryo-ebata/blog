import { getAllPosts } from '@/lib/posts';
import { HomePresenter } from './presenter';

export async function HomeContainer() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 5); // 最新5記事を表示
  // metadataのみを抽出してClient Componentに渡す
  const latestPostsMetadata = latestPosts.map((post) => post.metadata);
  return <HomePresenter latestPosts={latestPostsMetadata} />;
}
