import { Blog, Short } from '@nest/shared';

import { useLikeButton } from '../hooks/useLike';

export const LikeBlogButton: React.FC<{ post: Blog | Short }> = props => {
  const { post } = props;
  const { postLikeMutate, deleteLikeMutate, blogLikes } = useLikeButton(post.id);

  return (
    <div className="flex items-center">
      <button
        className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() =>
          blogLikes.data?.isLiked ? deleteLikeMutate.mutate() : postLikeMutate.mutate()
        }
        disabled={blogLikes.isLoading || postLikeMutate.isLoading || deleteLikeMutate.isLoading}
      >
        <span className="text-lg">
          {blogLikes.data?.likes} {blogLikes.data?.isLiked ? '❤️' : '🤍'}
        </span>
      </button>
    </div>
  );
};
