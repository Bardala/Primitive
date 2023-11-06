import { BlogLikesRes, CreateLikeRes, RemoveLikeRes } from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { blogLikesApi, createLikeApi, deleteLikeApi } from '../utils/api';

export const useLikeButton = (id: string) => {
  const { currUser } = useAuthContext();
  const key = ['likes', id];

  const blogLikes = useQuery<BlogLikesRes, ApiError>(key, blogLikesApi(id), {
    enabled: !!currUser?.jwt && !!id,
    refetchOnWindowFocus: false,
  });

  const postLikeMutate = useMutation<CreateLikeRes, ApiError>(createLikeApi(id), {
    onSuccess: () => blogLikes.refetch(),
  });

  const deleteLikeMutate = useMutation<RemoveLikeRes, ApiError>(deleteLikeApi(id), {
    onSuccess: () => blogLikes.refetch(),
  });

  return { postLikeMutate, deleteLikeMutate, blogLikes };
};
