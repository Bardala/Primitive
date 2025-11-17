import { useAuthContext } from '@/core/context';
import { useScroll } from '@/core/hooks';
import { ApiError } from '@/core/services';
import { getAllUnReadMsgsApi, userBlogsApi, userCardApi, userSpacesApi } from '@/core/utils';

import {
  AllUnReadMsgsRes,
  GetUserCardRes,
  PageSize,
  UserBlogsRes,
  UserSpacesRes,
} from '@nest/shared';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useProfileData = (userId: string) => {
  const { currUser } = useAuthContext();
  const isMyPage = currUser?.id === userId;
  const cardKey = ['userCard', userId];
  const spacesKey = ['userSpaces', userId];
  const blogsKey = ['userBlogs', userId];
  const [isEnd, setIsEnd] = useState(false);

  const userCardQuery = useQuery<GetUserCardRes, ApiError>(cardKey, userCardApi(userId), {
    enabled: !!currUser?.jwt && !!userId,
    refetchOnWindowFocus: false,
  });

  const userSpacesQuery = useQuery<UserSpacesRes, ApiError>(spacesKey, userSpacesApi(userId), {
    enabled: !!currUser?.jwt && !!userId && !!userCardQuery.data?.userCard,
    refetchOnWindowFocus: false,
  });

  const userBlogsQuery = useInfiniteQuery<UserBlogsRes, ApiError>(
    blogsKey,
    ({ pageParam = 1 }) => userBlogsApi(userId, pageParam),
    {
      enabled: !!currUser?.jwt && !!userId && !!userCardQuery.data?.userCard,
      refetchOnWindowFocus: false,
      getNextPageParam: lastPage => lastPage.page + 1,
      onSuccess: data => {
        if (data.pages[data.pages.length - 1].blogs.length < PageSize) {
          setIsEnd(true);
        }
      },
    }
  );

  useScroll(userBlogsQuery);

  return {
    userCardQuery,
    userSpacesQuery,
    userBlogsQuery,
    isMyPage,
    isEnd,
  };
};

export const useGetAllUserSpaces = (userId: string) =>
  useQuery<UserSpacesRes, ApiError>(['userSpaces', userId], userSpacesApi(userId), {
    enabled: !!userId,
  });

export const useGetAllMissedMsgs = () => {
  const { currUser } = useAuthContext();
  const key = ['missedMsgs'];

  const query = useQuery<AllUnReadMsgsRes, ApiError>(key, getAllUnReadMsgsApi(), {
    enabled: !!currUser?.jwt,
  });

  return { missedMsgs: query.data?.numberOfMsgs, refetch: query.refetch };
};
