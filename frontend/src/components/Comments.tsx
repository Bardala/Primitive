import {
  CommentWithUser,
  CreateCommentReq,
  CreateCommentRes,
  ENDPOINT,
  LoginRes,
} from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Markdown from 'markdown-to-jsx';
import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const Comments: React.FC<{
  blogId: string;
  currUser: LoginRes;
  comments: CommentWithUser[];
}> = ({ blogId, currUser, comments }) => {
  const { id } = useParams();

  const [commContent, setCommContent] = useState('');
  const queryClient = useQueryClient();

  const createCommMutation = useMutation<CreateCommentRes, ApiError>({
    mutationFn: () =>
      fetchFn<CreateCommentReq, CreateCommentRes>(
        ENDPOINT.CREATE_COMMENT,
        'POST',
        { content: commContent },
        currUser.jwt,
        [id!]
      ),
    onSuccess: data => {
      queryClient.invalidateQueries(['comments', blogId]);
      console.log('data', data);
      setCommContent('');
    },
    onError: err => console.log('err', err),
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
            value={commContent}
            onChange={e => setCommContent(e.target.value)}
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
                <Markdown className="comment-body">{comment.content}</Markdown>
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
