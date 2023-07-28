import {
  Blog,
  BlogLikesListReq,
  BlogLikesListRes,
  CreateLikeReq,
  CreateLikeRes,
  HOST,
  RemoveLikeReq,
  RemoveLikeRes,
} from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { ApiError, fetchFn } from '../fetch/auth';
import '../styles/like-button.css';

export const LikeBlogButton: React.FC<{ blog: Blog }> = props => {
  const { blog } = props;
  const { currUser } = useAuthContext();

  const blogLikesQuery = useQuery(
    ['blogLikes', blog.id],
    () =>
      fetchFn<BlogLikesListReq, BlogLikesListRes>(
        `${HOST}/blogLikesList/${blog.id}`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    { enabled: !!currUser?.jwt && !!blog.id, onError: err => console.log(err) }
  );

  const postLikeMutate = useMutation<CreateLikeReq, ApiError>(
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

  const deleteLikeMutate = useMutation<RemoveLikeReq, ApiError>(
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
            <span>{blogLikesQuery.data?.users?.length} </span>{' '}
            <i className="material-icons">favorite</i>
          </button>
        ) : (
          <button
            className="like-button"
            onClick={() => postLikeMutate.mutate()}
            disabled={postLikeMutate.isLoading}
          >
            <span>{blogLikesQuery.data?.users?.length} </span>{' '}
            <i className="material-icons">favorite</i>
          </button>
        )}
        {/* Add a span element to display the likes number */}
      </div>
    </>
  );
};
