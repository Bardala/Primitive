import { Blog, Short } from '@nest/shared';

import { useLikeButton } from '../hooks/useLike';
import '../styles/like-button.css';

export const LikeBlogButton: React.FC<{ post: Blog | Short }> = props => {
  const { post } = props;
  const { blogLikesQuery, postLikeMutate, deleteLikeMutate, isLiked } = useLikeButton(post.id);

  return (
    <>
      <div className="like-button-wrapper">
        {isLiked() ? (
          <button
            className="remove-like-button"
            onClick={() => deleteLikeMutate.mutate()}
            disabled={deleteLikeMutate.isLoading}
          >
            <span>{blogLikesQuery.data?.users?.length} ❤️</span>
          </button>
        ) : (
          <button
            className="like-button"
            onClick={() => postLikeMutate.mutate()}
            disabled={postLikeMutate.isLoading}
          >
            <span>{blogLikesQuery.data?.users?.length} 🤍 </span>
          </button>
        )}
      </div>
    </>
  );
};
