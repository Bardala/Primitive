import { Blog, DefaultSpaceId, Short } from '@nest/shared';
import { useEffect, useState } from 'react';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useSpace } from '../hooks/useSpace';

export const Home = () => {
  const { blogsQuery, spaceQuery, homeFeedsQuery: feedsQuery } = useSpace(DefaultSpaceId);
  const error = spaceQuery.error;
  const [blogs, setBlogs] = useState<Blog[] | Short[]>([]);

  // todo: update that from backend
  useEffect(() => {
    const blogs = [
      ...((blogsQuery.data?.blogs as Blog[]) || []),
      ...((feedsQuery.data?.feeds?.filter(
        b => b.spaceId !== spaceQuery.data?.space.id
      ) as Blog[]) || []),
    ].sort((a, b) => (b.timestamp as number) - (a.timestamp as number));
    setBlogs(blogs);
  }, [spaceQuery.data, feedsQuery.data, blogsQuery.data?.blogs]);

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.error) {
    return <div>{JSON.stringify(spaceQuery.error)}</div>;
  }

  return (
    <div className="home">
      <main>
        {error && <p className="error">{error?.message}</p>}
        {blogs?.length && <BlogList posts={blogs} />}
      </main>
      <Sidebar />
    </div>
  );
};
