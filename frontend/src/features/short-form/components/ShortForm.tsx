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
      {createShortMutation.isError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900">
          {createShortMutation.error.message}
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={createShortMutation.isLoading}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('shortForm.create')}
          </button>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm font-semibold text-text-secondary-light transition-all hover:bg-background-light dark:border-border-dark dark:bg-surface-dark dark:text-text-secondary-dark dark:hover:bg-background-dark"
          >
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
          className={`input-base w-full ${isArabic(title) ? 'text-right' : 'text-left'}`}
        />

        {preview ? (
          <div className="rounded-xl border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
            <MyMarkdown markdown={content} />
          </div>
        ) : (
          <textarea
            placeholder={t('shortForm.contentPlaceholder')}
            name="content"
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            className={`input-base min-h-[150px] w-full resize-y ${
              isArabic(content) ? 'text-right' : 'text-left'
            }`}
          />
        )}

        {createShortMutation.isLoading && (
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark animate-pulse">
            {t('shortForm.creating')}
          </p>
        )}
        {createShortMutation.isSuccess && (
          <p className="animate-in fade-in zoom-in duration-300 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-900">
            {t('shortForm.createdSuccess')}
          </p>
        )}
      </form>
    </>
  );
};
