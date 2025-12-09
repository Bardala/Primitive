import { useAuthContext } from '@/core/context';
import { useScroll } from '@/core/hooks';
import { ApiError } from '@/core/services';

import { FeedsReq, FeedsRes, PageSize } from '@nest/shared';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { FeedsApi } from '../api';

// export const useFeeds = () => {
//   const pageSize = PageSize;
//   const [isEnd, setIsEnd] = useState(false);
//   const key = ['feeds'];
//   const spaceQuery = useGetDefaultSpace();

//   const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
//     key,
//     ({ pageParam = 1 }) => FeedsApi.getFeeds(pageParam),
//     {
//       getNextPageParam: lastPage => lastPage.page + 1,
//       onSuccess: data =>
//         data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
//     }
//   );

//   useScroll(feedsQuery);

//   return {
//     spaceQuery,
//     feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
//     isLoading: feedsQuery.isLoading,
//     isError: feedsQuery.isError,
//     fetchNextPage: feedsQuery.fetchNextPage,
//     isEnd,
//   };
// };

// export const useSmartFeeds = () => {
//   const pageSize = PageSize;
//   const [isEnd, setIsEnd] = useState(false);
//   const smarterKey = ['smartFeeds'];

//   const spcKey = ['space', DefaultSpaceId];
//   const spaceQuery = useQuery<FeedsRes, ApiError>(spcKey, () => FeedsApi.getSmarterFeeds(1));

//   const smartFeedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
//     smarterKey,
//     ({ pageParam = 1 }) => FeedsApi.getSmarterFeeds(pageParam),
//     {
//       getNextPageParam: lastPage => lastPage.page + 1,
//       onSuccess: data =>
//         data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
//     }
//   );

//   useScroll(smartFeedsQuery);

//   return {
//     spaceQuery,
//     smartFeeds: smartFeedsQuery.data?.pages.flatMap(page => page.feeds) || [],
//     isLoading: smartFeedsQuery.isLoading,
//     isError: smartFeedsQuery.isError,
//     fetchNextPage: smartFeedsQuery.fetchNextPage,
//     isEnd,
//   };
// };

export const usePersonalFeeds = (queryParams?: Partial<FeedsReq>) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const key = ['personalFeeds', queryParams];

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    key,
    ({ pageParam = 1 }) => FeedsApi.getPersonalFeeds({ page: pageParam }),
    {
      enabled: !!currUser,
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

  useScroll(feedsQuery);

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
    refetch: () => queryClient.invalidateQueries(key),
  };
};

export const useSmartPersonalFeeds = (queryParams?: Partial<FeedsReq>) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const key = ['smartPersonalFeeds', queryParams];

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    key,
    ({ pageParam = 1 }) =>
      FeedsApi.getSmartFeeds({
        page: pageParam,
      }),
    {
      enabled: !!currUser,
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

  useScroll(feedsQuery);

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
    refetch: () => queryClient.invalidateQueries(key),
  };
};

export const useMixedFeeds = (queryParams?: Partial<FeedsReq>) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const key = ['mixedFeeds', queryParams];

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    key,
    ({ pageParam = 1 }) =>
      FeedsApi.getMixedFeeds({
        page: pageParam,
      }),
    {
      enabled: !!currUser,
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

  useScroll(feedsQuery);

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
    refetch: () => queryClient.invalidateQueries(key),
  };
};

export const usePublicFeeds = (queryParams?: Partial<FeedsReq>) => {
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const key = ['publicFeeds', queryParams];

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    key,
    ({ pageParam = 1 }) =>
      FeedsApi.getPublicFeeds({
        page: pageParam,
      }),
    {
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

  useScroll(feedsQuery);

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
  };
};

export const useSmartPublicFeeds = (queryParams?: Partial<FeedsReq>) => {
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const key = ['smartPublicFeeds', queryParams];

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    key,
    ({ pageParam = 1 }) =>
      FeedsApi.getSmartPublicFeeds({
        page: pageParam,
      }),
    {
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

  useScroll(feedsQuery);

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
  };
};

export const useUserFeeds = (userId: string, queryParams?: Partial<FeedsReq>) => {
  const pageSize = PageSize;
  const [isEnd, setIsEnd] = useState(false);
  const key = ['userFeeds', userId, queryParams];

  const feedsQuery = useInfiniteQuery<FeedsRes, ApiError>(
    key,
    ({ pageParam = 1 }) =>
      FeedsApi.getUserFeeds(userId, {
        page: pageParam,
      }),
    {
      enabled: !!userId,
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data =>
        data.pages[data.pages.length - 1].feeds.length < pageSize && setIsEnd(true),
    }
  );

  useScroll(feedsQuery);

  return {
    feeds: feedsQuery.data?.pages.flatMap(page => page.feeds) || [],
    isLoading: feedsQuery.isLoading,
    isError: feedsQuery.isError,
    fetchNextPage: feedsQuery.fetchNextPage,
    isEnd,
  };
};

export const useFeedsPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchFeeds = async (type: 'personal' | 'smart' | 'mixed' | 'public' | 'smartPublic') => {
    const keyMap = {
      personal: ['personalFeeds'],
      smart: ['smartPersonalFeeds'],
      mixed: ['mixedFeeds'],
      public: ['publicFeeds'],
      smartPublic: ['smartPublicFeeds'],
    };

    const defaultParams = { page: 1 };

    switch (type) {
      case 'personal':
        await queryClient.prefetchInfiniteQuery(keyMap.personal, () =>
          FeedsApi.getPersonalFeeds(defaultParams)
        );
        break;
      case 'smart':
        await queryClient.prefetchInfiniteQuery(keyMap.smart, () =>
          FeedsApi.getSmartFeeds(defaultParams)
        );
        break;
      case 'mixed':
        await queryClient.prefetchInfiniteQuery(keyMap.mixed, () =>
          FeedsApi.getMixedFeeds(defaultParams)
        );
        break;
      case 'public':
        await queryClient.prefetchInfiniteQuery(keyMap.public, () =>
          FeedsApi.getPublicFeeds(defaultParams)
        );
        break;
      case 'smartPublic':
        await queryClient.prefetchInfiniteQuery(keyMap.smartPublic, () =>
          FeedsApi.getSmartPublicFeeds(defaultParams)
        );
        break;
    }
  };

  const prefetchAllFeeds = async () => {
    await Promise.all([prefetchFeeds('personal'), prefetchFeeds('smart'), prefetchFeeds('mixed')]);
  };

  return {
    prefetchFeeds,
    prefetchAllFeeds,
  };
};
