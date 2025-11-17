import { isArabic } from '@/core/utils';
import { MyMarkdown, useCreateShort } from '@/features/blog';

import { DefaultSpaceId } from '@nest/shared';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-notifications-component/dist/theme.css';
import { useParams } from 'react-router-dom';

export const ShortForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const id = useParams().id || DefaultSpaceId;
  const { createShortMutation } = useCreateShort(id, title, content);

  const { t } = useTranslation();

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
            {t('shortForm.create')}
          </button>
          <button type="button" onClick={() => setPreview(!preview)}>
            {t('shortForm.preview')}
          </button>
        </div>

        <input
          placeholder={t('shortForm.titlePlaceholder')}
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={isArabic(title) ? 'arabic' : 'english'}
        />

        {preview ? (
          <MyMarkdown markdown={content} />
        ) : (
          <textarea
            placeholder={t('shortForm.contentPlaceholder')}
            name="content"
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className={isArabic(content) ? 'arabic' : 'english'}
          />
        )}

        {createShortMutation.isLoading && <p>{t('shortForm.creating')}</p>}
        {createShortMutation.isSuccess && (
          <p className="success">{t('shortForm.createdSuccess')}</p>
        )}
      </form>
    </>
  );
};
