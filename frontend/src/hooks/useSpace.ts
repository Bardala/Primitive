import {
  DefaultSpaceId,
  FeedsRes,
  JoinSpaceRes,
  MembersRes,
  SpaceBlogsRes,
  SpaceRes,
} from '@nest/shared';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { blogsApi, feedsApi, joinSpcApi, membersApi, spcApi } from '../utils/api';
import { useScroll } from './useScroll';

export const useSpace = (id: string) => {
  const currUser = useAuthContext().currUser;
  const queryClient = useQueryClient();
  const spcKey = ['space', id];
  const blogsKey = ['blogs', id];
  const membersKey = ['members', id];

  const spaceQuery = useQuery<SpaceRes, ApiError>(spcKey, spcApi(id), {
    enabled: !!currUser?.jwt && !!id,
    refetchOnWindowFocus: false,
  });

  const blogsQuery = useQuery<SpaceBlogsRes, ApiError>(blogsKey, blogsApi(id), {
    enabled: !!currUser && !!id && id !== DefaultSpaceId,
    refetchOnWindowFocus: false,
  });

  const membersQuery = useQuery<MembersRes, ApiError>(membersKey, membersApi(id), {
    enabled: !!currUser && !!spaceQuery.data?.space.id && id !== DefaultSpaceId,
    refetchOnWindowFocus: false,
  });

  const joinSpaceMutate = useMutation<JoinSpaceRes, ApiError>(joinSpcApi(id), {
    onSuccess: () => queryClient.invalidateQueries(['members', id]),
  });

  const isMember = membersQuery.data?.members?.some(member => member.memberId === currUser?.id);

  return {
    spaceQuery,
    blogsQuery,
    membersQuery,
    joinSpaceMutate,
    isMember,
  };
};

export const useFeeds = () => {
  const pageSize = 3;
  const { currUser } = useAuthContext();
  const [isEnd, setIsEnd] = useState(false);
  const key = ['feeds'];

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(key, feedsApi(), {
    enabled: !!currUser?.jwt,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    getNextPageParam: lastPage => {
      return lastPage.page + 1;
    },
    onSuccess: data => {
      if (data.pages[data.pages.length - 1].feeds.length < pageSize) {
        setIsEnd(true);
      }
    },
  });

  useScroll(feedsQuery);

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
  };
};
