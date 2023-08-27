import { DefaultSpaceId } from '@nest/shared';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useCreateShort } from '../hooks/useBlog';
import { ShortLength, isArabic } from '../utils/assists';

export const ShortForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const remaining = ShortLength - content.length;
  const id = useParams().id || DefaultSpaceId;
  const { createShortMutation } = useCreateShort(id, title, content);

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createShortMutation.mutate();
  };

  useEffect(() => {
    if (createShortMutation.isSuccess) {
      setTitle('');
      setContent('');
    }
  }, [createShortMutation.isSuccess]);

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
        {createShortMutation.isSuccess && <p className="success">Created successfully!</p>}
      </form>
    </>
  );
};
