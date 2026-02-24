import { ApiError } from '@/core/services';
import { userFollowingApi } from '@/core/utils';

import { useQuery } from '@tanstack/react-query';

export const useFollowing = (userId: string) => {
  const followingQuery = useQuery<{ followers: any[] }, ApiError>(
    ['following', userId],
    userFollowingApi(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
    }
  );

  return {
    followingQuery,
    following: followingQuery.data?.followers || [],
  };
};
