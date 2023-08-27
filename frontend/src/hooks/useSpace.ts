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
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

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

  // Disable for now
  const homeFeedsQuery = useQuery<FeedsRes, ApiError>({
    queryKey: ['feeds', DefaultSpaceId],
    queryFn: () => fetchFn<FeedsReq, FeedsRes>(ENDPOINT.GET_FEEDS, 'GET', undefined, currUser?.jwt),
    // enabled: !!currUser?.jwt,
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const isMember = membersQuery.data?.members?.some(member => member.memberId === currUser?.id);

  return {
    spaceQuery,
    blogsQuery,
    membersQuery,
    joinSpaceMutate,
    homeFeedsQuery,
    isMember,
  };
};

export const useFeeds = () => {
  const pageSize = 3;
  const { currUser } = useAuthContext();
  const [isEnd, setIsEnd] = useState(false);
  const key = ['feeds'];
  const fetchFeeds = ({ pageParam = 1 }) => {
    return fetchFn<FeedsReq, FeedsRes>(ENDPOINT.GET_FEEDS_PAGE, 'GET', undefined, currUser?.jwt, [
      pageParam + '',
    ]);
  };

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(key, fetchFeeds, {
    enabled: !!currUser?.jwt,
    refetchOnWindowFocus: false,
    getNextPageParam: lastPage => {
      return lastPage.page + 1;
    },
    onSuccess: data => {
      if (data.pages[data.pages.length - 1].feeds.length < pageSize) {
        setIsEnd(true);
      }
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        feedsQuery.fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
  };
};
