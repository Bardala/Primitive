import { Blog, LoginRes } from '@nest/shared';
import { useParams } from 'react-router-dom';

import { useDeleteBlog } from '../hooks/useBlog';

export const BlogDetailsAction: React.FC<{
  blog: Blog;
  owner: string;
  currUser: LoginRes;
}> = props => {
  const { blog, owner, currUser } = props;
  const { id } = useParams();
  const { deleteBlogMutate } = useDeleteBlog(id!, blog);
  const currUserOwnBlog = currUser?.id === owner;

  const handleDelete = () => {
    deleteBlogMutate.mutate();
  };

  return (
    <>
      {currUserOwnBlog && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteBlogMutate.isLoading}
          className="delete-button"
        >
          Delete
        </button>
      )}
      {deleteBlogMutate.isError && <p className="error">{deleteBlogMutate.error.message}</p>}
    </>
  );
};
