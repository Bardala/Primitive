import { HOST, JoinSpaceReq, JoinSpaceRes, SpaceReq, SpaceRes } from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
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
    onSuccess: data => console.log('members', data.members),
  });

  const joinSpaceMutate = useMutation(
    () =>
      fetchFn<JoinSpaceReq, JoinSpaceRes>(
        `${HOST}/joinSpace/${spaceQuery.data?.space?.id}`,
        'POST',
        undefined,
        currUser?.jwt
      ),
    {
      onSuccess: () => spaceQuery.refetch(),
    }
  );

  const blogs = spaceQuery.data?.blogs;

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.error) {
    return <div>{JSON.stringify(spaceQuery.error)}</div>;
  }

  const isMember = () => {
    return spaceQuery.data?.members?.some(member => member.memberId === currUser?.id);
  };

  return (
    <>
      <div className="home">
        <main>
          <h1>Space: {spaceQuery.data?.space?.name}</h1>
          {joinSpaceMutate.isError && <p>{JSON.stringify(joinSpaceMutate.error)}</p>}
          <nav>{!isMember() && <button onClick={() => joinSpaceMutate.mutate()}>Join</button>}</nav>

          {blogs?.length ? (
            <BlogList blogs={blogs} />
          ) : (
            <>
              <div className="not-found">
                <p>There isn't blogs</p>
              </div>
            </>
          )}
        </main>
        <Sidebar />
      </div>
    </>
  );
};
