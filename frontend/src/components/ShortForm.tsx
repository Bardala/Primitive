import { CreateBlogReq, CreateBlogRes, DefaultSpaceId, ENDPOINT } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';
import { ShortLength, isArabic } from '../utils/assists';

export const ShortForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { currUser } = useAuthContext();
  const remaining = ShortLength - content.length;

  const id = useParams().id || DefaultSpaceId;
  const queryClient = useQueryClient();
  const key = id === DefaultSpaceId ? ['feeds', DefaultSpaceId] : ['blogs', id];

  const createShortMutation = useMutation<CreateBlogRes, ApiError>({
    mutationFn: () =>
      fetchFn<CreateBlogReq, CreateBlogRes>(
        ENDPOINT.CREATE_BLOG,
        'POST',
        { title, content, spaceId: id || DefaultSpaceId },
        currUser?.jwt
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setTitle('');
      setContent('');
    },
  });

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createShortMutation.mutate();
  };

  return (
    <>
      {createShortMutation.isError && <p className="error">{createShortMutation.error.message}</p>}
      <form className="create-blog-form" onSubmit={handleSubmit}>
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
          maxLength={ShortLength}
          className={isArabic(content) ? 'arabic' : ''}
        />
        <i className="remaining-char">{remaining} remaining characters</i>

        <button type="submit" disabled={createShortMutation.isLoading}>
          Create
        </button>
        {createShortMutation.isLoading && <p>Creating...</p>}
      </form>
    </>
  );
};
