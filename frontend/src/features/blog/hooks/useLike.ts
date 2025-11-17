import { ApiError } from '@/core/services';
import { blogLikesApi, createLikeApi, deleteLikeApi } from '@/core/utils';

import { BlogLikesRes, CreateLikeRes, RemoveLikeRes } from '@nest/shared';

import { useMutation, useQuery } from '@tanstack/react-query';

export const useLikeButton = (id: string) => {
  const key = ['likes', id];

  const blogLikes = useQuery<BlogLikesRes, ApiError>(key, blogLikesApi(id), {
    enabled: !!id,
    refetchOnWindowFocus: true,
  });

  const postLikeMutate = useMutation<CreateLikeRes, ApiError>(createLikeApi(id), {
    onSuccess: () => blogLikes.refetch(),
  });

  const deleteLikeMutate = useMutation<RemoveLikeRes, ApiError>(deleteLikeApi(id), {
    onSuccess: () => blogLikes.refetch(),
  });

  return { postLikeMutate, deleteLikeMutate, blogLikes };
};
