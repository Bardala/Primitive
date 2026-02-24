import { Blog, LoginRes } from '@nest/shared';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import { useDeleteBlog } from '../hooks/useBlog';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { EditBlogModal } from './EditBlogModal';

export const BlogDetailsAction: React.FC<{
  blog: Blog;
  owner: string;
  currUser: LoginRes;
}> = ({ blog, owner, currUser }) => {
  const { id } = useParams();
  const { t } = useTranslation();
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center justify-center rounded-lg p-2 text-text-secondary-light transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
          title={t('blogActions.editBlog')}
        >
          <FiEdit size={18} />
        </button>

        {currUserOwnBlog && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteBlogMutate.isLoading}
            className="flex items-center justify-center rounded-lg p-2 text-text-secondary-light transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-text-secondary-dark dark:hover:bg-red-900/20 dark:hover:text-red-400"
            title={t('blogActions.deleteBlog')}
          >
            <FiTrash2 size={18} />
          </button>
        )}
        {deleteBlogMutate.isError && (
          <p className="text-sm text-red-500">{deleteBlogMutate.error.message}</p>
        )}
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
        itemName={t('blogActions.itemName')}
        itemTitle={blog.title}
        isLoading={deleteBlogMutate.isLoading}
      />
    </>
  );
};
