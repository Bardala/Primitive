import { CommentWithUser, CreateCommentRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FC, FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '../fetch/auth';
import { createCommApi } from '../utils/api';
import { isArabic } from '../utils/assists';
import { MyMarkdown } from './MyMarkdown';

export const Comments: FC<{
  blogId: string;
  comments: CommentWithUser[];
}> = ({ blogId, comments }) => {
  const { id } = useParams();
  const key = ['comments', blogId];
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const createCommMutation = useMutation<CreateCommentRes, ApiError>(createCommApi(content, id!), {
    onSuccess: data => {
      queryClient.invalidateQueries(key);
      setContent('');
    },
  });

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createCommMutation.mutate();
  };

  const isPending = createCommMutation.isLoading;

  return (
    <>
      <div className="blog-comments">
        <form onSubmit={handleSubmit} className="create-comment">
          <textarea
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
                <div className={isArabic(comment.content) ? 'arabic' : ''}>
                  <MyMarkdown markdown={comment.content} />
                </div>

                <Link className="comment-author" to={`/u/${comment.userId}`}>
                  {comment.author}
                </Link>
                <p className="created-at">
                  {formatDistanceToNow(new Date(comment.timestamp as number))} ago
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
