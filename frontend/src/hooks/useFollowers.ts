import { GetFollowersRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'src/context/AuthContext';
import { ApiError } from 'src/fetch/auth';
import { userFollowersApi } from 'src/utils/api';

export const useFollowers = (userId: string) => {
  const { currUser } = useAuthContext();

  const followersQuery = useQuery<GetFollowersRes, ApiError>(
    ['followers', userId],
    userFollowersApi(userId),
    {
      enabled: !!currUser?.jwt && !!userId,
      refetchOnWindowFocus: false,
    }
  );

  return {
    followersQuery,
    followers: followersQuery.data?.followers || [],
  };
};
