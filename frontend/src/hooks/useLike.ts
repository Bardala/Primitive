import {
  BlogLikesListReq,
  BlogLikesListRes,
  CreateLikeReq,
  CreateLikeRes,
  ENDPOINT,
  RemoveLikeReq,
  RemoveLikeRes,
} from '@nest/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const useLikeButton = (id: string) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();

  const blogLikesQuery = useQuery<BlogLikesListRes, ApiError>(
    ['likes', id],
    () =>
      fetchFn<BlogLikesListReq, BlogLikesListRes>(
        ENDPOINT.GET_BLOG_LIKES_LIST,
        'GET',
        undefined,
        currUser?.jwt,
        [id]
      ),
    {
      enabled: !!currUser?.jwt && !!id,
      onError: err => console.log(err),
      refetchOnWindowFocus: false,
    }
  );

  const postLikeMutate = useMutation<CreateLikeRes, ApiError>(
    () =>
      fetchFn<CreateLikeReq, CreateLikeRes>(ENDPOINT.LIKE_BLOG, 'POST', undefined, currUser?.jwt, [
        id,
      ]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['likes', id]);
      },
      onError: err => console.error('postLike error', err),
    }
  );

  const deleteLikeMutate = useMutation<RemoveLikeRes, ApiError>(
    () =>
      fetchFn<RemoveLikeReq, RemoveLikeRes>(
        ENDPOINT.UNLIKE_BLOG,
        'DELETE',
        undefined,
        currUser?.jwt,
        [id]
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['likes', id]);
      },
      onError: err => console.error('deleteLike error', err),
    }
  );

  const isLiked = () => {
    if (!currUser) return false;
    return blogLikesQuery.data?.users?.some(user => user.id === currUser?.id);
  };

  return { blogLikesQuery, postLikeMutate, deleteLikeMutate, isLiked };
};
