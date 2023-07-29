import { Blog, DeleteBlogReq, DeleteBlogRes, ENDPOINT, LoginRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchFn } from '../fetch';
import { LikeBlogButton } from './LikeBlogButton';

export const BlogDetailsAction: React.FC<{
  blog: Blog;
  owner: string;
  currUser: LoginRes;
}> = props => {
  const { blog, owner, currUser } = props;
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const deleteMutate = useMutation(
    () =>
      fetchFn<DeleteBlogReq, DeleteBlogRes>(
        ENDPOINT.DELETE_BLOG,
        'DELETE',
        undefined,
        currUser.jwt,
        [id!]
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['space', blog.spaceId]);
        queryClient.invalidateQueries(['blog', id]);
        blog.spaceId === '1' ? nav('/') : nav(`/space/${blog.spaceId}`);
      },
      onError: err => console.error('err', err),
    }
  );

  const handleDelete = () => {
    deleteMutate.mutate();
  };

  const isCurrUserOwnBlog = currUser?.id === owner;

  return (
    <>
      <LikeBlogButton blog={blog} />
      {isCurrUserOwnBlog && (
        <button onClick={handleDelete} disabled={deleteMutate.isLoading} className="delete-button">
          Delete
        </button>
      )}
      {/* {deleteError && <p className="error">{deleteError}</p>} */}
    </>
  );
};
