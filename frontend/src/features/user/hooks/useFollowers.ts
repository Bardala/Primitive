import { ApiError } from '@/core/services';
import { userFollowersApi } from '@/core/utils';

import { GetFollowersRes } from '@nest/shared';

import { useQuery } from '@tanstack/react-query';

export const useFollowers = (userId: string) => {
  const followersQuery = useQuery<GetFollowersRes, ApiError>(
    ['followers', userId],
    userFollowersApi(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
    }
  );

  return {
    followersQuery,
    followers: followersQuery.data?.followers || [],
  };
};
