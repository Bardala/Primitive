import { DefaultSpaceId } from '@nest/shared';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useSpace } from '../hooks/useSpace';

export const Home = () => {
  const { spaceQuery, homeFeedsQuery: feedsQuery } = useSpace(DefaultSpaceId);
  const error = spaceQuery.error;
  const feeds = feedsQuery.data?.feeds;

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.error) {
    return <div>{JSON.stringify(spaceQuery.error)}</div>;
  }

  return (
    <div className="home">
      <main>
        {error && <p className="error">{error?.message}</p>}
        {feeds?.length && <BlogList posts={feeds} />}
      </main>
      <Sidebar />
    </div>
  );
};
