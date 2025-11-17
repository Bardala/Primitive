import { useAuthContext } from '@/core/context';
import { ApiError } from '@/core/services';
import { createCommApi, deleteCommentApi, isArabic, updateCommentApi } from '@/core/utils';
import { UserLink } from '@/features/user';

import {
  CommentWithUser,
  CreateCommentRes,
  DeleteCommentReq,
  DeleteCommentRes,
  UpdateCommentReq,
  UpdateCommentRes,
} from '@nest/shared';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import { MyMarkdown } from './MyMarkdown';

import '../styles/comments.css';

// Maximum number of words to show before truncating
const MAX_WORDS_PREVIEW = 30;

export const Comments: FC<{
  blogId: string;
  comments: CommentWithUser[];
}> = ({ blogId, comments }) => {
  const { id } = useParams();
  const { currUser } = useAuthContext();
  const { t } = useTranslation();
  const key = ['comments', blogId];
  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  // Track which comments are expanded
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const createCommMutation = useMutation<CreateCommentRes, ApiError>(createCommApi(content, id!), {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setContent('');
    },
  });

  const updateCommentMutation = useMutation<UpdateCommentRes, ApiError, UpdateCommentReq>(
    data => updateCommentApi(data.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setEditingCommentId(null);
        setEditContent('');
      },
    }
  );

  const deleteCommentMutation = useMutation<DeleteCommentRes, ApiError, DeleteCommentReq>(
    data => deleteCommentApi(data.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
      },
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createCommMutation.mutate();
  };

  const handleEditStart = (comment: CommentWithUser) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleEditSubmit = (commentId: string) => {
    if (!editContent.trim()) return;

    updateCommentMutation.mutate({
      id: commentId,
      content: editContent,
    });
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm(t('comments.confirmDelete'))) {
      deleteCommentMutation.mutate({ id: commentId });
    }
  };

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const truncateComment = (content: string, maxWords: number): string => {
    const words = content.trim().split(/\s+/);
    if (words.length <= maxWords) return content;

    return words.slice(0, maxWords).join(' ') + '...';
  };

  const shouldTruncate = (content: string): boolean => {
    const words = content.trim().split(/\s+/);
    return words.length > MAX_WORDS_PREVIEW;
  };

  const isPending = createCommMutation.isLoading;

  return (
    <div className="blog-comments">
      <form onSubmit={handleSubmit} className="create-comment">
        <textarea
          className={isArabic(content) ? 'arabic' : 'english'}
          placeholder={t('comments.placeholder')}
          value={content}
          onChange={e => setContent(e.target.value)}
        ></textarea>
        <button className="add-comment" disabled={isPending}>
          {t('comments.add')}
        </button>
      </form>
      {createCommMutation.isError && <p className="error">{createCommMutation.error.message}</p>}

      <div className="comments">
        <p>{t('comments.title')}</p>
        {isPending ? (
          <p>{t('comments.loading')}</p>
        ) : (
          comments?.map(comment => {
            const isExpanded = expandedComments.has(comment.id);
            const needsTruncation = shouldTruncate(comment.content);
            const displayContent =
              isExpanded || !needsTruncation
                ? comment.content
                : truncateComment(comment.content, MAX_WORDS_PREVIEW);

            return (
              <div className="comment" key={comment.id}>
                {editingCommentId === comment.id ? (
                  <div className="comment-edit">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className={isArabic(editContent) ? 'arabic' : 'english'}
                      rows={3}
                    />
                    <div className="comment-edit-actions">
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        disabled={updateCommentMutation.isLoading || !editContent.trim()}
                        className="btn-comment-icon success"
                        title={t('comments.save')}
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        disabled={updateCommentMutation.isLoading}
                        className="btn-comment-icon"
                        title={t('comments.cancel')}
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={isArabic(comment.content) ? 'arabic' : 'english'}>
                    <MyMarkdown markdown={displayContent} />
                    {needsTruncation && !isExpanded && (
                      <button
                        className="read-more-btn"
                        onClick={() => toggleCommentExpansion(comment.id)}
                      >
                        {t('comments.readMore')}
                      </button>
                    )}
                    {isExpanded && needsTruncation && (
                      <button
                        className="read-less-btn"
                        onClick={() => toggleCommentExpansion(comment.id)}
                      >
                        {t('comments.readLess')}
                      </button>
                    )}
                  </div>
                )}

                <div className="comment-meta">
                  <UserLink userId={comment.userId} username={comment.author} />
                  <p className="created-at">
                    {formatDistanceToNow(new Date(comment.timestamp as number))} {t('comments.ago')}
                  </p>
                </div>

                {currUser && currUser.id === comment.userId && editingCommentId !== comment.id && (
                  <div className="comment-actions">
                    <button
                      onClick={() => handleEditStart(comment)}
                      className="btn-comment-icon"
                      title={t('comments.edit')}
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deleteCommentMutation.isLoading}
                      className="btn-comment-icon danger"
                      title={t('comments.delete')}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}

                {updateCommentMutation.isError &&
                  updateCommentMutation.variables?.id === comment.id && (
                    <p className="error">{updateCommentMutation.error.message}</p>
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
