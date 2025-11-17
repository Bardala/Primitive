import { useAuthContext } from '@/core/context';
import { ApiError } from '@/core/services';
import { followUserApi, unfollowUserApi, userFollowersApi } from '@/core/utils';

import { FollowUserRes, GetFollowersRes, UnFollowUserRes } from '@nest/shared';

import { useMutation, useQuery } from '@tanstack/react-query';

export const useFollow = (userId: string) => {
  const { currUser } = useAuthContext();
  const key = ['followers', userId];

  const followersQuery = useQuery<GetFollowersRes, ApiError>(key, userFollowersApi(userId), {
    enabled: !!userId,
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
