import { isArabic } from '@/core/utils';
import { useGetAllUserSpaces } from '@/features/user';

import { Blog } from '@nest/shared';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCode, FiEdit, FiEye, FiFolder, FiX } from 'react-icons/fi';

import { useUpdateBlog } from '../hooks';
import { MyMarkdown } from './MyMarkdown';

interface EditBlogModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
}

export const EditBlogModal: React.FC<EditBlogModalProps> = ({ blog, isOpen, onClose }) => {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [spaceId, setSpaceId] = useState(blog.spaceId);
  const [isPreview, setIsPreview] = useState(false);

  const updateBlogMutation = useUpdateBlog(blog.id);
  const { t } = useTranslation();

  const userSpacesQuery = useGetAllUserSpaces(blog.userId);
  const userSpaces = userSpacesQuery.data?.spaces || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await updateBlogMutation.mutateAsync({ title, content, spaceId });
      onClose();
    } catch (error) {
      console.error('Failed to update blog:', error);
    }
  };

  const handlePreviewToggle = () => {
    setIsPreview(!isPreview);
  };

  const getCurrentSpaceName = () => {
    const currentSpace = userSpaces.find(space => space.id === blog.spaceId);
    return currentSpace?.name || t('editBlogModal.unknownSpace');
  };

  const getAvailableSpaces = () => {
    return userSpaces.filter(space => space.id !== blog.spaceId);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-surface-light shadow-2xl ring-1 ring-border-light dark:bg-surface-dark dark:ring-border-dark"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4 dark:border-border-dark">
          <h3 className="flex items-center gap-2 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            <FiEdit className="text-primary-600 dark:text-primary-400" />
            {t('editBlogModal.title')}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviewToggle}
              className="rounded-lg p-2 text-text-secondary-light hover:bg-gray-100 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
              title={isPreview ? t('editBlogModal.switchToEdit') : t('editBlogModal.preview')}
            >
              {isPreview ? <FiCode size={20} /> : <FiEye size={20} />}
            </button>
            <button
              className="rounded-lg p-2 text-text-secondary-light hover:bg-red-50 hover:text-red-500 dark:text-text-secondary-dark dark:hover:bg-red-900/20 dark:hover:text-red-400"
              onClick={onClose}
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!isPreview ? (
              <>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="title"
                    className="font-medium text-text-primary-light dark:text-text-primary-dark"
                  >
                    {t('editBlogModal.fields.title')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={t('editBlogModal.placeholders.title')}
                    required
                    className={`input-base ${isArabic(title) ? 'text-right' : 'text-left'}`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="content"
                    className="font-medium text-text-primary-light dark:text-text-primary-dark"
                  >
                    {t('editBlogModal.fields.content')}
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={t('editBlogModal.placeholders.content')}
                    rows={12}
                    required
                    className={`input-base min-h-[200px] resize-y font-mono text-sm ${
                      isArabic(content) ? 'text-right' : 'text-left'
                    }`}
                  />
                </div>

                {/* Space Selection Section */}
                <div className="rounded-xl border border-border-light bg-gray-50 p-4 dark:border-border-dark dark:bg-background-dark/50">
                  <label
                    htmlFor="space"
                    className="mb-3 flex items-center gap-2 font-semibold text-text-primary-light dark:text-text-primary-dark"
                  >
                    <FiFolder className="text-primary-600 dark:text-primary-400" />
                    {t('editBlogModal.fields.space')}
                  </label>

                  {/* Current Space Display */}
                  <div className="mb-4 rounded-lg bg-surface-light p-3 shadow-sm ring-1 ring-border-light dark:bg-surface-dark dark:ring-border-dark">
                    <span className="mr-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                      {t('editBlogModal.currentSpace')}:
                    </span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {getCurrentSpaceName()}
                    </span>
                  </div>

                  {/* Move to Another Space Dropdown */}
                  {getAvailableSpaces().length > 0 && (
                    <div className="space-y-2">
                      <label
                        htmlFor="move-to-space"
                        className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
                      >
                        {t('editBlogModal.moveToSpace')}
                      </label>
                      <select
                        id="move-to-space"
                        value={spaceId}
                        onChange={e => setSpaceId(e.target.value)}
                        className="input-base"
                      >
                        <option value={blog.spaceId}>
                          {t('editBlogModal.keepInCurrentSpace')}
                        </option>
                        {getAvailableSpaces().map(space => (
                          <option key={space.id} value={space.id}>
                            {space.name}
                          </option>
                        ))}
                      </select>

                      {spaceId !== blog.spaceId && (
                        <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                          {t('editBlogModal.spaceChangeWarning')}
                        </p>
                      )}
                    </div>
                  )}

                  {userSpacesQuery.isLoading && (
                    <div className="text-center text-sm italic text-text-secondary-light dark:text-text-secondary-dark">
                      {t('editBlogModal.loadingSpaces')}
                    </div>
                  )}

                  {userSpacesQuery.isError && (
                    <div className="rounded bg-red-50 p-2 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {t('editBlogModal.errorLoadingSpaces')}
                    </div>
                  )}

                  {getAvailableSpaces().length === 0 && !userSpacesQuery.isLoading && (
                    <div className="text-center text-sm italic text-text-secondary-light dark:text-text-secondary-dark">
                      {t('editBlogModal.noOtherSpaces')}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-border-light pb-4 dark:border-border-dark">
                  <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {title || t('editBlogModal.untitled')}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <FiFolder className="text-primary-600 dark:text-primary-400" />
                    <span className="font-medium">
                      {spaceId === blog.spaceId
                        ? getCurrentSpaceName()
                        : userSpaces.find(space => space.id === spaceId)?.name ||
                          getCurrentSpaceName()}
                    </span>
                    {spaceId !== blog.spaceId && (
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        ({t('editBlogModal.willBeMoved')})
                      </span>
                    )}
                  </div>
                </div>
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  <MyMarkdown markdown={content || t('editBlogModal.noContent')} />
                </article>
              </div>
            )}

            {updateBlogMutation.isError && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {updateBlogMutation.error.message || t('editBlogModal.error')}
              </div>
            )}

            <div className="sticky bottom-0 mt-4 flex items-center justify-end gap-3 border-t border-border-light bg-surface-light pt-4 dark:border-border-dark dark:bg-surface-dark">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary-light transition-colors hover:bg-gray-100 hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-text-primary-dark"
                disabled={updateBlogMutation.isLoading}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={updateBlogMutation.isLoading || !title.trim() || !content.trim()}
              >
                {updateBlogMutation.isLoading
                  ? t('editBlogModal.updating')
                  : spaceId !== blog.spaceId
                  ? t('editBlogModal.updateAndMove')
                  : t('editBlogModal.update')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
