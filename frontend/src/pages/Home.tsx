import { Blog, ENDPOINT, FeedsReq, FeedsRes, SpaceReq, SpaceRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError, isLoggedIn } from '../fetch/auth';

export const Home = () => {
  const { currUser } = useAuthContext();
  const nav = useNavigate();

  const spaceQuery = useQuery<SpaceRes, ApiError>({
    queryKey: ['space', 'home'],
    queryFn: () =>
      fetchFn<SpaceReq, SpaceRes>(ENDPOINT.GET_DEFAULT_SPACE, 'GET', undefined, currUser?.jwt),
    enabled: !!currUser?.jwt,
  });

  const feedsQuery = useQuery<FeedsRes, ApiError>({
    queryKey: ['feeds', 'home'],
    queryFn: () => fetchFn<FeedsReq, FeedsRes>(ENDPOINT.GET_FEEDS, 'GET', undefined, currUser?.jwt),
    enabled: !!currUser?.jwt,
  });

  const error = spaceQuery.error;

  useEffect(() => {
    if (!isLoggedIn()) {
      nav('/login');
    }
  }, [currUser, nav]);

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.error) {
    return <div>{JSON.stringify(spaceQuery.error)}</div>;
  }

  // todo: update that from backend
  const blogs = [
    ...((spaceQuery.data?.blogs as Blog[]) || []),
    ...((feedsQuery.data?.feeds?.filter(b => b.spaceId !== spaceQuery.data?.space.id) as Blog[]) ||
      []),
  ];
  blogs.sort((a, b) => (b.timestamp as number) - (a.timestamp as number));

  return (
    <div className="home">
      <main>
        {error && <p className="error">{error?.message}</p>}
        {blogs?.length && <BlogList blogs={blogs} />}
      </main>
      <Sidebar />
    </div>
  );
};
