import { BlogLikesListRes, CreateLikeRes, RemoveLikeRes } from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { blogLikesApi, createLikeApi, deleteLikeApi } from '../utils/api';

export const useLikeButton = (id: string) => {
  const { currUser } = useAuthContext();
  const key = ['likes', id];

  const blogLikesQuery = useQuery<BlogLikesListRes, ApiError>(key, blogLikesApi(id), {
    enabled: !!currUser?.jwt && !!id,
    onError: err => console.log(err),
    refetchOnWindowFocus: false,
  });

  const postLikeMutate = useMutation<CreateLikeRes, ApiError>(createLikeApi(id), {
    onSuccess: () => blogLikesQuery.refetch(),
  });

  const deleteLikeMutate = useMutation<RemoveLikeRes, ApiError>(deleteLikeApi(id), {
    onSuccess: () => blogLikesQuery.refetch(),
  });

  const isLiked = () => {
    if (!currUser) return false;
    return blogLikesQuery.data?.users?.some(user => user.id === currUser?.id);
  };

  return { blogLikesQuery, postLikeMutate, deleteLikeMutate, isLiked };
};
