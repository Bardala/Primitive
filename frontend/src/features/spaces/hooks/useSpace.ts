import { useAuthContext } from '@/core/context';
import { useScroll } from '@/core/hooks';
import { ApiError } from '@/core/services';
import {
  blogsApi,
  feedsApi,
  getNumOfUnReadMsgsApi,
  joinSpcApi,
  membersApi,
  smarterFeedsApi,
  spcApi,
} from '@/core/utils';

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

export const useSpace = (id: string) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const spcKey = ['space', id];
  const blogsKey = ['blogs', id];
  const membersKey = ['members', id];
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);

  const spaceQuery = useQuery<SpaceRes, ApiError>(spcKey, spcApi(id), {
    enabled: !!id,
  });

  const blogsQuery = useInfiniteQuery<SpaceBlogsRes, ApiError>(
    blogsKey,
    ({ pageParam = 1 }) => blogsApi(id, pageParam),
    {
      enabled: !!id && id !== DefaultSpaceId && spaceQuery.isSuccess,
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].blogs.length < pageSize && setIsEnd(true),
    }
  );

  const membersQuery = useQuery<MembersRes, ApiError>(membersKey, membersApi(id), {
    enabled: !!spaceQuery.data?.space.id && id !== DefaultSpaceId && spaceQuery.isSuccess,
  });

  const joinSpaceMutate = useMutation<JoinSpaceRes, ApiError>(joinSpcApi(id), {
    onSuccess: () => queryClient.invalidateQueries(['members', id]),
  });

  const isMember = membersQuery.data?.members?.some(member => member.memberId === currUser?.id);
  useScroll(blogsQuery);

  return {
    spaceQuery,
    blogsQuery,
    membersQuery,
    joinSpaceMutate,
    isMember,
    isEnd,
  };
};

export const useGetSpcMissedMsgs = (id: string) => {
  const msgsNumKey = ['unreadMsgsNum', id];

  const numOfUnReadMsgs = useQuery<UnReadMsgsNumRes, ApiError>(
    msgsNumKey,
    () => getNumOfUnReadMsgsApi(id),
    {
      enabled: !!id && id !== DefaultSpaceId,
    }
  );

  return { numOfUnReadMsgs };
};

export const useFeeds = () => {
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const key = ['feeds'];

  const spcKey = ['space', DefaultSpaceId];
  const spaceQuery = useQuery<SpaceRes, ApiError>(spcKey, spcApi(DefaultSpaceId), {
    enabled: !!DefaultSpaceId,
  });

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    key,
    ({ pageParam = 1 }) => feedsApi(pageParam),
    {
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

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

export const useSmartFeeds = () => {
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const smarterKey = ['smartFeeds'];

  const spcKey = ['space', DefaultSpaceId];
  const spaceQuery = useQuery<SpaceRes, ApiError>(spcKey, spcApi(DefaultSpaceId), {
    enabled: !!DefaultSpaceId,
  });

  const smartFeedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    smarterKey,
    ({ pageParam = 1 }) => smarterFeedsApi(pageParam),
    {
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

  useScroll(smartFeedsQuery);

  return {
    spaceQuery,
    smartFeeds: smartFeedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: smartFeedsQuery.isLoading,
    isError: smartFeedsQuery.isError,
    fetchNextPage: smartFeedsQuery.fetchNextPage,
    isEnd,
  };
};
