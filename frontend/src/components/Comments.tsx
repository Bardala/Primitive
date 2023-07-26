import { Comment, CreateCommentReq, CreateCommentRes, HOST, LoginRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Markdown from 'markdown-to-jsx';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchFn } from '../fetch/auth';

export const Comments: React.FC<{ blogId: string; currUser: LoginRes; comments: Comment[] }> = ({
  blogId,
  currUser,
  comments,
}) => {
  const { id } = useParams();

  const [commContent, setCommContent] = useState('');
  const queryClient = useQueryClient();

  const createCommMutation = useMutation({
    mutationFn: () =>
      fetchFn<CreateCommentReq, CreateCommentRes>(
        `${HOST}/comment`,
        'POST',
        { content: commContent, blogId: id! },
        currUser?.jwt
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
          <p>Create Comment</p>
          <textarea
            placeholder="write your comment"
            value={commContent}
            onChange={e => setCommContent(e.target.value)}
          ></textarea>
          <button className="add-comment" disabled={isPending}>
            Add comment
          </button>
        </form>
        {createCommMutation.isError && <p className="error">Something went wrong</p>}

        <div className="comments">
          <p>Comments</p>
          {isPending ? (
            <p>Loading comments...</p>
          ) : (
            comments?.map(comment => (
              <div className="comment" key={comment.id}>
                <Markdown className="comment-body">{comment.content}</Markdown>
                <p className="comment-author">{comment.author}</p>
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
