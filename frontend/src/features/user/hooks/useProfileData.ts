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

import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { PrivateChatSocketApi } from '../../chat/api/private-chat-socket.api';

export const useProfileData = (userId: string) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const isMyPage = currUser?.id === userId;

  const cardKey = useMemo(() => ['userCard', userId], [userId]);
  const spacesKey = useMemo(() => ['userSpaces', userId], [userId]);
  const blogsKey = useMemo(() => ['userBlogs', userId], [userId]);

  const [isEnd, setIsEnd] = useState(false);

  // Listen for user status changes to update the profile card
  useEffect(() => {
    if (!userId) return;

    const cleanup = PrivateChatSocketApi.onUserStatusChange(data => {
      if (data.userId === userId) {
        queryClient.setQueryData<GetUserCardRes>(cardKey, oldData => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            userCard: {
              ...oldData.userCard,
              isOnline: data.isOnline,
              lastSeen: data.lastActive || (oldData.userCard as any).lastSeen,
              activity: data.lastActive
                ? {
                    ...(oldData.userCard as any).activity,
                    lastActive: data.lastActive,
                  }
                : (oldData.userCard as any).activity,
            } as any,
          };
        });
      }
    });

    return cleanup;
  }, [userId, queryClient, cardKey]);

  const userCardQuery = useQuery<GetUserCardRes, ApiError>(cardKey, userCardApi(userId), {
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  const userSpacesQuery = useQuery<UserSpacesRes, ApiError>(spacesKey, userSpacesApi(userId), {
    enabled: !!userId && !!userCardQuery.data?.userCard,
    refetchOnWindowFocus: false,
  });

  const userBlogsQuery = useInfiniteQuery<UserBlogsRes, ApiError>(
    blogsKey,
    ({ pageParam = 1 }) => userBlogsApi(userId, pageParam),
    {
      enabled: !!userId && !!userCardQuery.data?.userCard,
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

/**
 * Un-enabled
 * @returns
 */
export const useGetAllMissedMsgs = () => {
  const key = ['missedMsgs'];

  const query = useQuery<AllUnReadMsgsRes, ApiError>(key, getAllUnReadMsgsApi(), {
    enabled: false,
  });

  return { missedMsgs: query.data?.numberOfMsgs, refetch: query.refetch };
};
