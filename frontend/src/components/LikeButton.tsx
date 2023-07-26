import { Blog } from '@nest/shared';
// import { useAuthContext } from '../context/AuthContext';
// import { usePostLike } from '../hooks/blogsApis';
import { FormEvent } from 'react';

const LikeBlogButton: React.FC<{ blog: Blog }> = ({ blog }) => {
  // const {currUser: user} = useAuthContext();
  // const { error, postLike, isPending, likes } = usePostLike();

  const handleLikeButton = (e: FormEvent, blogId: string) => {
    e.preventDefault();
    // postLike(blogId, user);
    console.log('Like button clicked');
  };

  return (
    <>
      {/* {error && <p className="error">{error}</p>} */}
      <button
        className="likes-count"
        onClick={e => handleLikeButton(e, blog.id)}
        // disabled={isPending}
      >
        {/* {likes || blog.likes} likes */}
      </button>
    </>
  );
};

export default LikeBlogButton;
