import { HOST, SpaceReq, SpaceRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useAuthContext } from '../context/AuthContext';
import { ApiError, fetchFn, isLoggedIn } from '../fetch/auth';

export const Home = () => {
  const { currUser } = useAuthContext();
  const nav = useNavigate();

  const spaceQuery = useQuery<SpaceRes, ApiError, SpaceRes>({
    queryKey: ['space', '1'],
    queryFn: () =>
      fetchFn<SpaceReq, SpaceRes>(`${HOST}/getDefaultSpace`, 'GET', undefined, currUser?.jwt),
    enabled: !!currUser?.jwt,
  });

  const blogs = spaceQuery.data?.blogs;
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
