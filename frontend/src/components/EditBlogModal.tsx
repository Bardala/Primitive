// components/EditBlogModal.tsx
import { Blog } from '@nest/shared';
import { useState } from 'react';
import { FiCode, FiEdit, FiEye, FiX } from 'react-icons/fi';
import { useUpdateBlog } from 'src/hooks/useBlog';
import { isArabic } from 'src/utils/assists';

import { MyMarkdown } from './MyMarkdown';

interface EditBlogModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
}

export const EditBlogModal: React.FC<EditBlogModalProps> = ({ blog, isOpen, onClose }) => {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [isPreview, setIsPreview] = useState(false);
  const updateBlogMutation = useUpdateBlog(blog.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await updateBlogMutation.mutateAsync({ title, content });
      onClose();
    } catch (error) {
      console.error('Failed to update blog:', error);
    }
  };

  const handlePreviewToggle = () => {
    setIsPreview(!isPreview);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FiEdit className="modal-icon" />
            Edit Blog
          </h3>
          <div className="modal-header-actions">
            <button
              type="button"
              onClick={handlePreviewToggle}
              className="btn-icon"
              title={isPreview ? 'Switch to edit mode' : 'Preview blog'}
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
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  required
                  className={isArabic(title) ? 'arabic' : ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your blog content..."
                  rows={10}
                  required
                  className={isArabic(content) ? 'arabic' : ''}
                />
              </div>
            </>
          ) : (
            <div className="preview-container">
              <div className="preview-header">Preview</div>
              <article className="preview-content">
                <h2 className="preview-title">{title || 'Untitled'}</h2>
                <div className="preview-markdown">
                  <MyMarkdown markdown={content || '*No content yet*'} />
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
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={updateBlogMutation.isLoading || !title.trim() || !content.trim()}
            >
              {updateBlogMutation.isLoading ? 'Updating...' : 'Update Blog'}
            </button>
          </div>

          {updateBlogMutation.isError && (
            <div className="error-message">
              {updateBlogMutation.error.message || 'Failed to update blog'}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
