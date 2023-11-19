import {
  DefaultSpaceId,
  FeedsRes,
  JoinSpaceRes,
  MembersRes,
  PageSize,
  SpaceBlogsRes,
  SpaceRes,
  UnReadMsgsNumRes,
} from '@nest/shared';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import {
  blogsApi,
  feedsApi,
  getNumOfUnReadMsgsApi,
  joinSpcApi,
  membersApi,
  spcApi,
} from '../utils/api';
import { useScroll } from './useScroll';

// todo: Make isMemberApi
// todo: Don't make unnecessary fetches, Clean up
export const useSpace = (id: string) => {
  const currUser = useAuthContext().currUser;
  const queryClient = useQueryClient();
  const spcKey = ['space', id];
  const blogsKey = ['blogs', id];
  const membersKey = ['members', id];
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);

  const spaceQuery = useQuery<SpaceRes, ApiError>(spcKey, spcApi(id), {
    enabled: !!currUser?.jwt && !!id,
    refetchOnWindowFocus: false,
  });

  const blogsQuery = useInfiniteQuery<SpaceBlogsRes, ApiError>(blogsKey, blogsApi(id), {
    enabled: !!currUser && !!id && id !== DefaultSpaceId && spaceQuery.isSuccess,
    refetchOnWindowFocus: false,
    getNextPageParam: lastPage => lastPage.page + 1,
    onSuccess: data => data.pages[data.pages.length - 1].blogs.length < pageSize && setIsEnd(true),
  });

  const membersQuery = useQuery<MembersRes, ApiError>(membersKey, membersApi(id), {
    enabled:
      !!currUser && !!spaceQuery.data?.space.id && id !== DefaultSpaceId && spaceQuery.isSuccess,
    refetchOnWindowFocus: false,
  });

  const joinSpaceMutate = useMutation<JoinSpaceRes, ApiError>(joinSpcApi(id), {
    onSuccess: () => queryClient.invalidateQueries(['members', id]),
  });

  const isMember = membersQuery.data?.members?.some(member => member.memberId === currUser?.id);
  useScroll(blogsQuery);

  // const numOfUnReadMsgs = useQuery<UnReadMsgsNumRes, ApiError>(
  //   msgsNumKey,
  //   getNumOfUnReadMsgsApi(id),
  //   {
  //     enabled: !!currUser?.jwt && !!id && id !== DefaultSpaceId,
  //     // refetchOnWindowFocus: false,
  //   }
  // );

  return {
    spaceQuery,
    blogsQuery,
    membersQuery,
    // numOfUnReadMsgs,
    joinSpaceMutate,
    isMember,
    isEnd,
  };
};

export const useGetSpcMissedMsgs = (id: string) => {
  const currUser = useAuthContext().currUser;
  const msgsNumKey = ['unreadMsgsNum', id];

  const numOfUnReadMsgs = useQuery<UnReadMsgsNumRes, ApiError>(
    msgsNumKey,
    getNumOfUnReadMsgsApi(id),
    {
      enabled: !!currUser?.jwt && !!id && id !== DefaultSpaceId,
    }
  );

  return { numOfUnReadMsgs };
};

export const useFeeds = () => {
  const pageSize = PageSize;
  const { currUser } = useAuthContext();
  const [isEnd, setIsEnd] = useState(false);
  const key = ['feeds'];

  const spcKey = ['space', DefaultSpaceId];
  const spaceQuery = useQuery<SpaceRes, ApiError>(spcKey, spcApi(DefaultSpaceId), {
    enabled: !!currUser?.jwt && !!DefaultSpaceId,
    refetchOnWindowFocus: false,
  });

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(key, feedsApi(), {
    enabled: !!currUser?.jwt,
    refetchOnWindowFocus: false,
    getNextPageParam: lastPage => lastPage.page + 1,
    onSuccess: data => data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
  });

  useScroll(feedsQuery);

  return {
    spaceQuery,
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
  };
};
