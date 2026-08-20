import { useAuthContext } from '@/core/context';
import { ApiError } from '@/core/services';
import { followUserApi, unfollowUserApi, userFollowersApi, userFollowingApi } from '@/core/utils';

import { FollowUserRes, GetFollowersRes, UnFollowUserRes } from '@nest/shared';

import { useMutation, useQuery } from '@tanstack/react-query';

export const useFollowing = (userId: string | null) => {
  const key = ['following', userId];
  return useQuery<GetFollowersRes, ApiError>(key, userFollowingApi(userId!), {
    enabled: !!userId,
    refetchInterval: 30000, // Refetch presence every 30s
  });
};

export const useFollow = (userId: string) => {
  const { currUser } = useAuthContext();
  const key = ['followers', userId];

  const followersQuery = useQuery<GetFollowersRes, ApiError>(key, userFollowersApi(userId), {
    enabled: !!userId,
  });

  const followingQuery = useFollowing(currUser?.id || null);

  const followMutation = useMutation<FollowUserRes, ApiError>(followUserApi(userId), {
    onSuccess: () => followersQuery.refetch(),
  });

  const unfollowMutation = useMutation<UnFollowUserRes, ApiError>(unfollowUserApi(userId), {
    onSuccess: () => followersQuery.refetch(),
  });

  const isFollowing = followersQuery.data?.followers.some(follower => follower.id === currUser?.id);
  const isFollowed = followingQuery.data?.followers.some(follower => follower.id === userId);

  return {
    followMutation,
    unfollowMutation,
    isFollowing,
    isFollowed,
    followersQuery,
  };
};
