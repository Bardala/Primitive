import {
  Blog,
  BlogLikesReq,
  BlogLikesRes,
  CreateLikeReq,
  CreateLikeRes,
  HOST,
  RemoveLikeReq,
  RemoveLikeRes,
} from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { useAuthContext } from '../context/AuthContext';
import { ApiError, fetchFn } from '../fetch/auth';

export const LikeBlogButton: React.FC<{ blog: Blog }> = props => {
  // todo: update like status
  const { blog } = props;
  const { currUser } = useAuthContext();
  const [isLiked, setIsLiked] = useState(false);

  const blogLikesQuery = useQuery(
    ['blogLikes', blog.id],
    () =>
      fetchFn<BlogLikesReq, BlogLikesRes>(
        `${HOST}/blogLikes/${blog.id}`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    {
      enabled: !!currUser?.jwt && !!blog.id,
      onError: err => console.error('err', err),
    }
  );

  const postLike = useMutation<CreateLikeReq, ApiError>(
    () =>
      fetchFn<CreateLikeReq, CreateLikeRes>(
        `${HOST}/likeBlog/${blog.id}`,
        'POST',
        undefined,
        currUser?.jwt
      ),
    {
      onSuccess: () => blogLikesQuery.refetch(),
      onError: err => console.error('postLike error', err),
    }
  );

  const deleteLike = useMutation<RemoveLikeReq, ApiError>(
    () =>
      fetchFn<RemoveLikeReq, RemoveLikeRes>(
        `${HOST}/unLikeBlog/${blog.id}`,
        'DELETE',
        undefined,
        currUser?.jwt
      ),
    {
      onSuccess: () => blogLikesQuery.refetch(),
      onError: err => console.error('deleteLike error', err),
    }
  );

  const handleLikeButton = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    isLiked ? postLike.mutate() : deleteLike.mutate();
  };

  return (
    <>
      {postLike.isError && <p className="error">{postLike.error.message}</p>}
      <button
        className="likes-count"
        onClick={e => handleLikeButton(e)}
        disabled={postLike.isLoading}
      >
        {blogLikesQuery.data?.likesNums} likes
      </button>
    </>
  );
};
