import { FollowUserRes, GetFollowersRes, UnFollowUserRes } from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { followUserApi, unfollowUserApi, userFollowersApi } from '../utils/api';

export const useFollow = (userId: string) => {
  const { currUser } = useAuthContext();
  const key = ['followers', userId];

  const followersQuery = useQuery<GetFollowersRes, ApiError>(key, userFollowersApi(userId), {
    enabled: !!currUser?.jwt && !!userId,
  });

  const followMutation = useMutation<FollowUserRes, ApiError>(followUserApi(userId), {
    onSuccess: () => followersQuery.refetch(),
  });
  const unfollowMutation = useMutation<UnFollowUserRes, ApiError>(unfollowUserApi(userId), {
    onSuccess: () => followersQuery.refetch(),
  });

  const isFollowing = followersQuery.data?.followers.some(follower => follower.id === currUser?.id);

  return {
    followMutation,
    unfollowMutation,
    isFollowing,
    followersQuery,
  };
};
