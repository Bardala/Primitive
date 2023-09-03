import { Blog, Short } from '@nest/shared';

import { useLikeButton } from '../hooks/useLike';
import '../styles/like-button.css';

export const LikeBlogButton: React.FC<{ post: Blog | Short }> = props => {
  const { post } = props;
  const { postLikeMutate, deleteLikeMutate, blogLikes } = useLikeButton(post.id);

  return (
    <>
      <div className="like-button-wrapper">
        <button
          className="like-button"
          onClick={() =>
            blogLikes.data?.isLiked ? deleteLikeMutate.mutate() : postLikeMutate.mutate()
          }
          disabled={blogLikes.isLoading || postLikeMutate.isLoading || deleteLikeMutate.isLoading}
        >
          <span>
            {blogLikes.data?.likes} {blogLikes.data?.isLiked ? '❤️' : '🤍'}
          </span>
        </button>
      </div>
    </>
  );
};
