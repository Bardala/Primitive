import { GetFollowersRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from 'src/fetch/auth';
import { userFollowersApi } from 'src/utils/api';

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
