import {
  DefaultSpaceId,
  ENDPOINT,
  JoinSpaceReq,
  JoinSpaceRes,
  MembersReq,
  MembersRes,
  SpaceReq,
  SpaceRes,
} from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { Sidebar } from '../components/SideBar';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';
import { Home } from './Home';

// import '../styles/space.css';

export const Space = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const spaceQuery = useQuery<SpaceRes, ApiError>({
    queryKey: ['space', id],
    queryFn: () =>
      fetchFn<SpaceReq, SpaceRes>(ENDPOINT.GET_SPACE, 'GET', undefined, currUser?.jwt, [id!]),
    enabled: !!currUser && !!id,
  });

  const membersQuery = useQuery<MembersRes, ApiError>(
    ['members', id],
    () =>
      fetchFn<MembersReq, MembersRes>(ENDPOINT.GET_SPACE_MEMBERS, 'GET', undefined, currUser?.jwt, [
        id!,
      ]),
    { enabled: !!currUser && !!spaceQuery.data?.space.id }
  );

  const joinSpaceMutate = useMutation<JoinSpaceRes, ApiError>(
    () =>
      fetchFn<JoinSpaceReq, JoinSpaceRes>(ENDPOINT.JOIN_SPACE, 'POST', undefined, currUser?.jwt, [
        id!,
      ]),
    {
      onSuccess: () => queryClient.invalidateQueries(['members', id]),
    }
  );

  const isMember = () => {
    return membersQuery.data?.members?.some(member => member.memberId === currUser?.id);
  };

  const blogs = spaceQuery.data?.blogs;

  if (spaceQuery.isLoading) return <div>Loading...</div>;
  if (spaceQuery.isError) return <p className="error">{spaceQuery.error?.message}</p>;
  if (id === DefaultSpaceId) return <Home />;

  return (
    <>
      <div className="home">
        <main className="space-page">
          <div className="space-header">
            <h1>Space: {spaceQuery.data?.space?.name}</h1>
            <span>{spaceQuery.data?.space?.status}</span>
          </div>
          {joinSpaceMutate.isError && <p>{joinSpaceMutate.error.message}</p>}
          <nav>
            <>
              {!isMember() && (
                <button
                  className="join-space"
                  onClick={() => joinSpaceMutate.mutate()}
                  disabled={joinSpaceMutate.isLoading}
                >
                  Join
                </button>
              )}
            </>
          </nav>
          {/** //todo: move the description to the sidebar */}
          {/* <span className="space-description">{spaceQuery.data?.space?.description}</span> */}

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
        <Sidebar space={spaceQuery.data?.space} members={membersQuery.data?.members} />
      </div>
    </>
  );
};
