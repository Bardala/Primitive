import {
  DefaultSpaceId,
  ENDPOINT,
  FeedsReq,
  FeedsRes,
  JoinSpaceReq,
  JoinSpaceRes,
  MembersReq,
  MembersRes,
  SpaceBlogsReq,
  SpaceBlogsRes,
  SpaceReq,
  SpaceRes,
} from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const useSpace = (id: string) => {
  const currUser = useAuthContext().currUser;
  const queryClient = useQueryClient();

  const spaceQuery = useQuery<SpaceRes, ApiError>({
    queryKey: ['space', id],
    queryFn: () =>
      fetchFn<SpaceReq, SpaceRes>(ENDPOINT.GET_SPACE, 'GET', undefined, currUser?.jwt, [id!]),
    enabled: !!currUser?.jwt && !!id,
    refetchOnWindowFocus: false,
  });

  const blogsQuery = useQuery<SpaceBlogsRes, ApiError>(
    ['blogs', id],
    () =>
      fetchFn<SpaceBlogsReq, SpaceBlogsRes>(
        ENDPOINT.GET_SPACE_BLOGS,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    { enabled: !!currUser && !!id && id !== DefaultSpaceId, refetchOnWindowFocus: false }
  );

  // const shortsQuery = useQuery<SpaceShortsRes, ApiError>(
  //   ['shorts', id],
  //   () =>
  //     fetchFn<SpaceShortsReq, SpaceShortsRes>(
  //       ENDPOINT.GET_SPACE_SHORTS,
  //       'GET',
  //       undefined,
  //       currUser?.jwt,
  //       [id!]
  //     ),
  //   { enabled: !!currUser?.jwt && !!id, refetchOnWindowFocus: false }
  // );

  const membersQuery = useQuery<MembersRes, ApiError>(
    ['members', id],
    () =>
      fetchFn<MembersReq, MembersRes>(ENDPOINT.GET_SPACE_MEMBERS, 'GET', undefined, currUser?.jwt, [
        id!,
      ]),
    { enabled: !!currUser && !!spaceQuery.data?.space.id, refetchOnWindowFocus: false }
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

  const homeFeedsQuery = useQuery<FeedsRes, ApiError>({
    queryKey: ['feeds', DefaultSpaceId],
    queryFn: () => fetchFn<FeedsReq, FeedsRes>(ENDPOINT.GET_FEEDS, 'GET', undefined, currUser?.jwt),
    enabled: !!currUser?.jwt,
    refetchOnWindowFocus: false,
  });

  const isMember = membersQuery.data?.members?.some(member => member.memberId === currUser?.id);

  return {
    spaceQuery,
    blogsQuery,
    // shortsQuery,
    membersQuery,
    joinSpaceMutate,
    homeFeedsQuery,
    isMember,
  };
};
