import { Blog, LoginRes } from '@nest/shared';
import { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import { useDeleteBlog } from '../hooks/useBlog';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { EditBlogModal } from './EditBlogModal';

export const BlogDetailsAction: React.FC<{
  blog: Blog;
  owner: string;
  currUser: LoginRes;
}> = props => {
  const { blog, owner, currUser } = props;
  const { id } = useParams();
  const { deleteBlogMutate } = useDeleteBlog(id!, blog);
  const currUserOwnBlog = currUser?.id === owner;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    deleteBlogMutate.mutate();
    setIsDeleteModalOpen(false);
  };

  if (currUser.id !== owner) return null;

  return (
    <>
      <div className="blog-actions">
        <button onClick={() => setIsEditModalOpen(true)} className="btn-icon" title="Edit blog">
          <FiEdit />
        </button>

        {currUserOwnBlog && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteBlogMutate.isLoading}
            className="btn-icon danger"
            title="Delete blog"
          >
            <FiTrash2 />
          </button>
        )}
        {deleteBlogMutate.isError && <p className="error">{deleteBlogMutate.error.message}</p>}
      </div>

      <EditBlogModal
        blog={blog}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName="blog"
        itemTitle={blog.title}
        isLoading={deleteBlogMutate.isLoading}
      />
    </>
  );
};
