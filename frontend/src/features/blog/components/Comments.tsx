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
import { FC, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { useLocation, useParams } from 'react-router-dom';

import { MyMarkdown } from './MyMarkdown';

// import '../styles/comments.css';

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
  const location = useLocation();

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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const commentId = searchParams.get('commentId');

    if (commentId && !isPending) {
      // Small delay to ensure comments are rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add(
            'ring-2',
            'ring-primary-600',
            'bg-primary-50',
            'dark:bg-primary-900/20'
          );
          // Optional: remove highlight after some time
          setTimeout(
            () =>
              element.classList.remove(
                'ring-2',
                'ring-primary-600',
                'bg-primary-50',
                'dark:bg-primary-900/20'
              ),
            3000
          );
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.search, isPending, comments]);

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="mb-8 flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark sm:p-6"
      >
        <textarea
          className={`input-base min-h-[100px] resize-y ${
            isArabic(content) ? 'text-right' : 'text-left'
          }`}
          placeholder={t('comments.placeholder')}
          value={content}
          onChange={e => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end">
          <button className="btn-primary" disabled={isPending}>
            {t('comments.add')}
          </button>
        </div>
      </form>
      {createCommMutation.isError && (
        <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {createCommMutation.error.message}
        </p>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('comments.title')}
        </h3>
        {isPending ? (
          <p className="animate-pulse text-center text-text-secondary-light dark:text-text-secondary-dark">
            {t('comments.loading')}
          </p>
        ) : (
          comments?.map(comment => {
            const isExpanded = expandedComments.has(comment.id);
            const needsTruncation = shouldTruncate(comment.content);
            const displayContent =
              isExpanded || !needsTruncation
                ? comment.content
                : truncateComment(comment.content, MAX_WORDS_PREVIEW);

            return (
              <div
                className="group relative rounded-xl border border-border-light bg-surface-light p-4 shadow-sm transition-all hover:shadow-md dark:border-border-dark dark:bg-surface-dark sm:p-6"
                key={comment.id}
                id={`comment-${comment.id}`}
              >
                {editingCommentId === comment.id ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className={`input-base min-h-[80px] ${
                        isArabic(editContent) ? 'text-right' : 'text-left'
                      }`}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        disabled={updateCommentMutation.isLoading || !editContent.trim()}
                        className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                        title={t('comments.save')}
                      >
                        <FiCheck size={18} />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        disabled={updateCommentMutation.isLoading}
                        className="rounded-lg p-2 text-text-secondary-light hover:bg-gray-100 hover:text-red-500 dark:text-text-secondary-dark dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        title={t('comments.cancel')}
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={isArabic(comment.content) ? 'text-right' : 'text-left'}>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-text-primary-light dark:text-text-primary-dark">
                      <MyMarkdown markdown={displayContent} />
                    </div>
                    {needsTruncation && !isExpanded && (
                      <button
                        className="mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                        onClick={() => toggleCommentExpansion(comment.id)}
                      >
                        {t('comments.readMore')}
                      </button>
                    )}
                    {isExpanded && needsTruncation && (
                      <button
                        className="mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                        onClick={() => toggleCommentExpansion(comment.id)}
                      >
                        {t('comments.readLess')}
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-border-light pt-3 dark:border-border-dark">
                  <div className="flex items-center gap-2">
                    <UserLink userId={comment.userId} username={comment.author} />
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      •
                    </span>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {formatDistanceToNow(Number(comment.timestamp))} {t('comments.ago')}
                    </p>
                  </div>

                  {currUser &&
                    currUser.id === comment.userId &&
                    editingCommentId !== comment.id && (
                      <div className="flex opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-0">
                        <button
                          onClick={() => handleEditStart(comment)}
                          className="rounded-lg p-1.5 text-text-secondary-light hover:bg-gray-100 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                          title={t('comments.edit')}
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={deleteCommentMutation.isLoading}
                          className="rounded-lg p-1.5 text-text-secondary-light hover:bg-red-50 hover:text-red-500 dark:text-text-secondary-dark dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title={t('comments.delete')}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                </div>

                {updateCommentMutation.isError &&
                  updateCommentMutation.variables?.id === comment.id && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {updateCommentMutation.error.message}
                    </p>
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
