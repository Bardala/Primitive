import { ENDPOINT, JoinSpaceReq, JoinSpaceRes, SpaceReq, SpaceRes } from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import '../styles/space.css';

export const Space = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();

  const spaceQuery = useQuery({
    queryKey: ['space', id],
    queryFn: () =>
      fetchFn<SpaceReq, SpaceRes>(ENDPOINT.GET_SPACE, 'GET', undefined, currUser?.jwt, [id!]),
    enabled: !!currUser && !!id,
    onSuccess: data => console.log('members', data.members),
  });

  const joinSpaceMutate = useMutation(
    () =>
      fetchFn<JoinSpaceReq, JoinSpaceRes>(ENDPOINT.JOIN_SPACE, 'POST', undefined, currUser?.jwt, [
        id!,
      ]),
    {
      onSuccess: () => spaceQuery.refetch(),
    }
  );

  // const getMembersMutate = useMutation(() =>
  //   fetchFn(`${HOST}/members/${id}`, 'GET', undefined, currUser?.jwt)
  // );

  // todo: move to sidebar
  // todo: make a separate api for getting members
  // const addMemberMutate = useMutation(
  //   () => fetchFn(`${HOST}/addMember/${id}`, 'POST', undefined, currUser?.jwt),
  //   {
  //     onSuccess: () => spaceQuery.refetch(),
  //   }
  // );
  // const isAdmin = () => {
  //   return spaceQuery.data?.members?.some(member => member.memberId === currUser?.id && member.isAdmin);
  // };

  const blogs = spaceQuery.data?.blogs;

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.error) {
    return <div>{JSON.stringify(spaceQuery.error)}</div>;
  }

  // const isMember = () => {
  //   return spaceQuery.data?.members?.some(member => member.memberId === currUser?.id);
  // };

  return (
    <>
      <div className="home">
        <main className="space-page">
          <h1>Space: {spaceQuery.data?.space?.name}</h1>
          {joinSpaceMutate.isError && <p>{JSON.stringify(joinSpaceMutate.error)}</p>}
          <nav>
            <>
              {/* {!isMember() && ( */}
              <button className="join-space" onClick={() => joinSpaceMutate.mutate()}>
                Join
              </button>
              {/* )} */}
            </>
          </nav>
          <span className="space-description">{spaceQuery.data?.space.description}</span>

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
        <Sidebar space={spaceQuery.data?.space!} />
      </div>
    </>
  );
};
