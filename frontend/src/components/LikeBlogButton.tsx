import { Blog, Short } from '@nest/shared';

import { useLikeButton } from '../hooks/useLike';
import '../styles/like-button.css';

export const LikeBlogButton: React.FC<{ post: Blog | Short }> = props => {
  const { post } = props;
  const { blogLikesQuery, postLikeMutate, deleteLikeMutate, isLiked } = useLikeButton(post.id);

  return (
    <>
      <div className="like-button-wrapper">
        <button
          className="like-button"
          onClick={() => (isLiked() ? deleteLikeMutate.mutate() : postLikeMutate.mutate())}
        >
          <span>
            {blogLikesQuery.data?.users.length} {isLiked() ? '❤️' : '🤍'}
          </span>
        </button>
      </div>
    </>
  );
};
