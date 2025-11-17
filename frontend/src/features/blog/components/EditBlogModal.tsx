import { isArabic } from '@/core/utils';
import { useGetAllUserSpaces } from '@/features/user';

import { Blog } from '@nest/shared';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCode, FiEdit, FiEye, FiFolder, FiX } from 'react-icons/fi';

import { useUpdateBlog } from '../hooks';
import { MyMarkdown } from './MyMarkdown';

import '../styles/editBlogModal.css';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FiEdit className="modal-icon" />
            {t('editBlogModal.title')}
          </h3>
          <div className="modal-header-actions">
            <button
              type="button"
              onClick={handlePreviewToggle}
              className="btn-icon"
              title={isPreview ? t('editBlogModal.switchToEdit') : t('editBlogModal.preview')}
            >
              {isPreview ? <FiCode /> : <FiEye />}
            </button>
            <button className="modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-blog-form">
          {!isPreview ? (
            <>
              <div className="form-group">
                <label htmlFor="title">{t('editBlogModal.fields.title')}</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={t('editBlogModal.placeholders.title')}
                  required
                  className={isArabic(title) ? 'arabic' : 'english'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">{t('editBlogModal.fields.content')}</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={t('editBlogModal.placeholders.content')}
                  rows={10}
                  required
                  className={isArabic(content) ? 'arabic' : 'english'}
                />
              </div>

              {/* Space Selection Section */}
              <div className="form-group">
                <label htmlFor="space" className="space-label">
                  <FiFolder className="space-icon" />
                  {t('editBlogModal.fields.space')}
                </label>

                {/* Current Space Display */}
                <div className="current-space-info">
                  <span className="current-space-label">{t('editBlogModal.currentSpace')}:</span>
                  <span className="current-space-name">{getCurrentSpaceName()}</span>
                </div>

                {/* Move to Another Space Dropdown */}
                {getAvailableSpaces().length > 0 && (
                  <div className="space-selection">
                    <label htmlFor="move-to-space" className="move-space-label">
                      {t('editBlogModal.moveToSpace')}
                    </label>
                    <select
                      id="move-to-space"
                      value={spaceId}
                      onChange={e => setSpaceId(e.target.value)}
                      className="space-select"
                    >
                      <option value={blog.spaceId}>{t('editBlogModal.keepInCurrentSpace')}</option>
                      {getAvailableSpaces().map(space => (
                        <option key={space.id} value={space.id}>
                          {space.name}
                        </option>
                      ))}
                    </select>
                    <div className="space-selection-help">
                      {spaceId !== blog.spaceId && (
                        <span className="space-change-warning">
                          {t('editBlogModal.spaceChangeWarning')}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {userSpacesQuery.isLoading && (
                  <div className="space-loading">{t('editBlogModal.loadingSpaces')}</div>
                )}

                {userSpacesQuery.isError && (
                  <div className="space-error">{t('editBlogModal.errorLoadingSpaces')}</div>
                )}

                {getAvailableSpaces().length === 0 && !userSpacesQuery.isLoading && (
                  <div className="no-other-spaces">{t('editBlogModal.noOtherSpaces')}</div>
                )}
              </div>
            </>
          ) : (
            <div className="preview-container">
              <div className="preview-header">{t('editBlogModal.previewHeader')}</div>
              <article className="preview-content">
                <h2 className="preview-title">{title || t('editBlogModal.untitled')}</h2>
                <div className="preview-space-info">
                  <FiFolder className="preview-space-icon" />
                  <span className="preview-space-name">
                    {spaceId === blog.spaceId
                      ? getCurrentSpaceName()
                      : userSpaces.find(space => space.id === spaceId)?.name ||
                        getCurrentSpaceName()}
                  </span>
                  {spaceId !== blog.spaceId && (
                    <span className="preview-space-change">({t('editBlogModal.willBeMoved')})</span>
                  )}
                </div>
                <div className="preview-markdown">
                  <MyMarkdown markdown={content || t('editBlogModal.noContent')} />
                </div>
              </article>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
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

          {updateBlogMutation.isError && (
            <div className="error-message">
              {updateBlogMutation.error.message || t('editBlogModal.error')}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
