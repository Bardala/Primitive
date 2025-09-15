// pages/Home.tsx
import { useSmartFeeds } from 'src/hooks/useSpace';

import { BlogList } from '../components/BlogList';
import { ActionBar } from '../components/SideBar';

export const Home = () => {
  const { smartFeeds, fetchNextPage, isEnd, isLoading, spaceQuery } = useSmartFeeds();

  if (spaceQuery.isError) return <p className="error">{spaceQuery.error.message}</p>;
  if (spaceQuery.isLoading) return <div>Loading...</div>;

  return (
    <div className="home">
      <main>
        {!!smartFeeds?.length && (
          <BlogList posts={smartFeeds} isEnd={isEnd} fetchNextPage={fetchNextPage} />
        )}
        {smartFeeds?.length === 0 && !isLoading && (
          <div className="not-found">
            <p>Follow users or join to different spaces to see their blogs here</p>
          </div>
        )}
      </main>
      <ActionBar />
    </div>
  );
};
