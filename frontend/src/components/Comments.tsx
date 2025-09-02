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
import { FiCheck, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import '../styles/comments.css';
import { createCommApi, deleteCommentApi, updateCommentApi } from '../utils/api';
import { isArabic } from '../utils/assists';
import { MyMarkdown } from './MyMarkdown';

export const Comments: FC<{
  blogId: string;
  comments: CommentWithUser[];
}> = ({ blogId, comments }) => {
  const { id } = useParams();
  const { currUser } = useAuthContext();
  const key = ['comments', blogId];
  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const queryClient = useQueryClient();

  const createCommMutation = useMutation<CreateCommentRes, ApiError>(createCommApi(content, id!), {
    onSuccess: data => {
      queryClient.invalidateQueries(key);
      setContent('');
    },
  });

  const updateCommentMutation = useMutation<UpdateCommentRes, ApiError, UpdateCommentReq>(
    data => updateCommentApi(data.id, data)(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        setEditingCommentId(null);
        setEditContent('');
      },
    }
  );

  const deleteCommentMutation = useMutation<DeleteCommentRes, ApiError, DeleteCommentReq>(
    data => deleteCommentApi(data.id)(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
      },
    }
  );

  const handleSubmit = (e: MouseEvent | FormEvent) => {
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
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate({ id: commentId });
    }
  };

  const isPending = createCommMutation.isLoading;

  return (
    <>
      <div className="blog-comments">
        <form onSubmit={handleSubmit} className="create-comment">
          <textarea
            className={isArabic(content) ? 'arabic' : ''}
            placeholder="write your comment"
            value={content}
            onChange={e => setContent(e.target.value)}
          ></textarea>
          <button className="add-comment" disabled={isPending}>
            Add comment
          </button>
        </form>
        {createCommMutation.isError && <p className="error">{createCommMutation.error.message}</p>}

        <div className="comments">
          <p>Comments</p>
          {isPending ? (
            <p>Loading comments...</p>
          ) : (
            comments?.map(comment => (
              <div className="comment" key={comment.id}>
                {editingCommentId === comment.id ? (
                  <div className="comment-edit">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className={isArabic(editContent) ? 'arabic' : ''}
                      rows={3}
                    />
                    <div className="comment-edit-actions">
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        disabled={updateCommentMutation.isLoading || !editContent.trim()}
                        className="btn-comment-icon success"
                        title="Save changes"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        disabled={updateCommentMutation.isLoading}
                        className="btn-comment-icon"
                        title="Cancel edit"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={isArabic(comment.content) ? 'arabic' : ''}>
                    <MyMarkdown markdown={comment.content} />
                  </div>
                )}

                <div className="comment-meta">
                  <Link className="comment-author" to={`/u/${comment.userId}`}>
                    {comment.author}
                  </Link>
                  <p className="created-at">
                    {formatDistanceToNow(new Date(comment.timestamp as number))} ago
                  </p>
                </div>

                {currUser && currUser.id === comment.userId && editingCommentId !== comment.id && (
                  <div className="comment-actions">
                    <button
                      onClick={() => handleEditStart(comment)}
                      className="btn-comment-icon"
                      title="Edit comment"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deleteCommentMutation.isLoading}
                      className="btn-comment-icon danger"
                      title="Delete comment"
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
            ))
          )}
        </div>
      </div>
    </>
  );
};
