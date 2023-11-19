import { DefaultSpaceId } from '@nest/shared';
import { FormEvent, useEffect, useState } from 'react';
import 'react-notifications-component/dist/theme.css';
import { useParams } from 'react-router-dom';

import { useCreateShort } from '../hooks/useBlog';
import { isArabic } from '../utils/assists';
import { MyMarkdown } from './MyMarkdown';

export const ShortForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
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
        <div className="button-container">
          <button type="submit" disabled={createShortMutation.isLoading}>
            Create
          </button>
          <button type="button" onClick={() => setPreview(!preview)}>
            Preview
          </button>
        </div>

        <input
          placeholder="Title"
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {preview ? (
          <MyMarkdown markdown={content} />
        ) : (
          <textarea
            placeholder="Content"
            name="content"
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ direction: isArabic(content) ? 'rtl' : 'ltr' }}
          />
        )}

        {createShortMutation.isLoading && <p>Creating...</p>}
        {createShortMutation.isSuccess && <p className="success">Created successfully!</p>}
      </form>
    </>
  );
};
