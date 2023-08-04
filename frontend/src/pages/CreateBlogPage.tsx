import { CreateBlogReq, CreateBlogRes, DefaultSpaceId, ENDPOINT } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MyMarkdown } from '../components/MyMarkdown';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';
import '../styles/create-blog-page.css';

export const CreateBlogPage: React.FC = () => {
  const { spaceId, spaceName } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { currUser } = useAuthContext();
  const nav = useNavigate();

  const queryClient = useQueryClient();

  // todo: create a custom hook for this
  const createBlogMutation = useMutation<CreateBlogRes, ApiError>({
    mutationFn: () =>
      fetchFn<CreateBlogReq, CreateBlogRes>(
        ENDPOINT.CREATE_BLOG,
        'POST',
        { title, content, spaceId: spaceId! },
        currUser?.jwt
      ),
    onSuccess: data => {
      queryClient.invalidateQueries(['space', spaceId || 'home']);
      console.log('data', data);
      setTitle('');
      setContent('');
      spaceId === DefaultSpaceId ? nav('/') : nav(`/space/${spaceId}`);
    },
    onError: err => {
      console.error('err', err);
    },
  });

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createBlogMutation.mutate();
  };

  return (
    <div className="create">
      <h4>
        Add a New Blog to <strong>{spaceName}</strong> Space
      </h4>
      <form onSubmit={e => handleSubmit(e)}>
        <label className="title-label">Blog Title:</label>

        <input
          className="title-input"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label className="body-label">Blog body:</label>
        <MyMarkdown markdown={content} />
        <textarea
          className="body-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
        ></textarea>
        <button disabled={createBlogMutation.isLoading}>Add Blog</button>
      </form>
      {createBlogMutation.isError && <p className="error">{createBlogMutation.error.message}</p>}
    </div>
  );
};
