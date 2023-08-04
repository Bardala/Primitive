import { CreateBlogReq, CreateBlogRes, ENDPOINT } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const CreateBlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { currUser } = useAuthContext();

  const { id } = useParams();
  const queryClient = useQueryClient();

  const createBlogMutation = useMutation<CreateBlogRes, ApiError>({
    mutationFn: () =>
      fetchFn<CreateBlogReq, CreateBlogRes>(
        ENDPOINT.CREATE_BLOG,
        'POST',
        { title, content, spaceId: id! || '1' },
        currUser?.jwt
      ),
    onSuccess: data => {
      queryClient.invalidateQueries(['space', id || 'home']);
      console.log('data', data);
      setTitle('');
      setContent('');
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
    <>
      {createBlogMutation.isError && <p className="error">{createBlogMutation.error.message}</p>}
      <form className="create-blog-from" onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          name="content"
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <button type="submit" disabled={createBlogMutation.isLoading}>
          Create
        </button>
        {createBlogMutation.isLoading && <p>Creating...</p>}
      </form>
    </>
  );
};
