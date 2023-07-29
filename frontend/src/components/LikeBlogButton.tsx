import {
  Blog,
  BlogLikesListReq,
  BlogLikesListRes,
  CreateLikeReq,
  CreateLikeRes,
  ENDPOINT,
  RemoveLikeReq,
  RemoveLikeRes,
} from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';
import '../styles/like-button.css';

export const LikeBlogButton: React.FC<{ blog: Blog }> = props => {
  const { blog } = props;
  const { currUser } = useAuthContext();

  const blogLikesQuery = useQuery<BlogLikesListRes, ApiError>(
    ['blogLikes', blog.id],
    () =>
      fetchFn<BlogLikesListReq, BlogLikesListRes>(
        ENDPOINT.GET_BLOG_LIKES_LIST,
        'GET',
        undefined,
        currUser?.jwt,
        [blog.id]
      ),
    {
      enabled: !!currUser?.jwt && !!blog.id,
      onError: err => console.log(err),
    }
  );

  const postLikeMutate = useMutation<CreateLikeRes, ApiError>(
    () =>
      fetchFn<CreateLikeReq, CreateLikeRes>(ENDPOINT.LIKE_BLOG, 'POST', undefined, currUser?.jwt, [
        blog.id,
      ]),
    {
      onSuccess: () => blogLikesQuery.refetch(),
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
        [blog.id]
      ),
    {
      onSuccess: () => blogLikesQuery.refetch(),
      onError: err => console.error('deleteLike error', err),
    }
  );

  const isLiked = () => {
    if (!currUser) return false;
    return blogLikesQuery.data?.users?.some(user => user.id === currUser?.id);
  };

  return (
    <>
      {/* {postLikeMutate.isError && <p className="error">{postLikeMutate.error.message}</p>} */}
      <div className="like-button-wrapper">
        {isLiked() ? (
          <button
            className="remove-like-button"
            onClick={() => deleteLikeMutate.mutate()}
            disabled={deleteLikeMutate.isLoading}
          >
            <span>{blogLikesQuery.data?.users?.length} </span>
            <i className="material-icons">favorite</i>
          </button>
        ) : (
          <button
            className="like-button"
            onClick={() => postLikeMutate.mutate()}
            disabled={postLikeMutate.isLoading}
          >
            <span>{blogLikesQuery.data?.users?.length} </span>
            <i className="material-icons">favorite</i>
          </button>
        )}
      </div>
    </>
  );
};
