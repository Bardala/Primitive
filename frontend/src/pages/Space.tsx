import { HOST, SpaceReq, SpaceRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch/auth';
import '../styles/sidebar.css';

export const Space = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();

  const spaceQuery = useQuery({
    queryKey: ['space', id],
    queryFn: () =>
      fetchFn<SpaceReq, SpaceRes>(`${HOST}/space/${id}`, 'GET', undefined, currUser?.jwt),
    enabled: !!currUser,
  });

  const blogs = spaceQuery.data?.blogs;

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.error) {
    return <div>{JSON.stringify(spaceQuery.error)}</div>;
  }

  return (
    <>
      <div className="home">
        <main>
          <h1>Space: {spaceQuery.data?.space?.name}</h1>

          {blogs?.length && <BlogList blogs={blogs} />}
        </main>
        <Sidebar />
      </div>
    </>
  );
};
