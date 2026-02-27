import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBold, FiCode, FiImage, FiItalic, FiLink, FiList, FiType } from 'react-icons/fi';
import { MdFormatQuote } from 'react-icons/md';

import { useCreateBlog } from '../hooks/useBlog';
import { useUserSeries } from '../hooks/useSeries';
import { MyMarkdown } from './MyMarkdown';

interface BlogFormProps {
  spaceId: string;
  spaceName?: string;
  onSuccess?: () => void;
}

// TODO: Make it simpler
export const ShortForm: React.FC<BlogFormProps> = ({ spaceId, spaceName, onSuccess }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectionToolbar, setSelectionToolbar] = useState<{ x: number; y: number } | null>(null);

  const { data: userSeries } = useUserSeries();
  const { createBlogMutation } = useCreateBlog(spaceId);

  useEffect(() => {
    if (createBlogMutation.isSuccess) {
      setTitle('');
      setContent('');
      setTags([]);
      setSelectedSeriesId('');
      if (onSuccess) onSuccess();
    }
  }, [createBlogMutation.isSuccess, onSuccess]);

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createBlogMutation.mutate({
      title,
      content,
      spaceId,
      seriesId: selectedSeriesId || undefined,
      tagNames: tags.length > 0 ? tags : undefined,
    });
  };

  const wrapSelection = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.substring(0, start) + text + content.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formattingOptions = [
    { icon: <FiBold />, action: () => wrapSelection('**', '**'), title: t('createBlog.bold') },
    { icon: <FiItalic />, action: () => wrapSelection('*', '*'), title: t('createBlog.italic') },
    {
      icon: <FiLink />,
      action: () => insertAtCursor('[link text](https://)'),
      title: t('createBlog.insertLink'),
    },
    { icon: <FiCode />, action: () => wrapSelection('`', '`'), title: t('createBlog.inlineCode') },
    {
      icon: <FiImage />,
      action: () => insertAtCursor('![alt text](image-url)'),
      title: t('createBlog.insertImage'),
    },
    { icon: <FiList />, action: () => insertAtCursor('- List item'), title: t('createBlog.list') },
    { icon: <MdFormatQuote />, action: () => insertAtCursor('> '), title: t('createBlog.quote') },
    {
      icon: <FiType />,
      action: () => wrapSelection('```\n', '\n```'),
      title: t('createBlog.codeBlock'),
    },
  ];

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSelect = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const rect = textarea.getBoundingClientRect();
      setSelectionToolbar({
        x: rect.left + rect.width / 2,
        y: rect.top - 40,
      });
    } else {
      setSelectionToolbar(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {spaceId && (
        <h2 className="mb-4 text-center text-2xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
          {t('createBlog.addNew')}{' '}
          {spaceName && <i className="text-primary-600 dark:text-primary-400">{spaceName}</i>}{' '}
          {t('createBlog.space')}
        </h2>
      )}
      {createBlogMutation.isError && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900">
          {createBlogMutation.error?.message}
        </div>
      )}

      <div className="mb-2">
        <input
          className={`w-full rounded-lg border border-border-light bg-background-light p-3 text-xl font-bold text-text-primary-light placeholder-text-secondary-light focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 dark:border-border-dark dark:bg-background-dark dark:text-text-primary-dark dark:placeholder-text-secondary-dark dark:focus:border-primary-400 dark:focus:ring-primary-400`}
          type="text"
          required
          value={title}
          placeholder={t('createBlog.titlePlaceholder')}
          onChange={e => setTitle(e.target.value)}
          dir="auto"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
            {t('createBlog.selectSeries')}
          </label>
          <select
            value={selectedSeriesId}
            onChange={e => setSelectedSeriesId(e.target.value)}
            className="w-full rounded-lg border border-border-light bg-background-light p-2 text-sm text-text-primary-light focus:border-primary-600 focus:outline-none dark:border-border-dark dark:bg-background-dark dark:text-text-primary-dark"
          >
            <option value="">{t('createBlog.noSeries')}</option>
            {userSeries?.series?.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
            {t('createBlog.tags')}
          </label>
          <div className="flex flex-wrap gap-1 rounded-lg border border-border-light bg-background-light p-2 focus-within:border-primary-600 dark:border-border-dark dark:bg-background-dark min-h-[42px]">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={t('createBlog.tagsPlaceholder')}
              className="flex-1 bg-transparent p-1 text-xs outline-none placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-light dark:border-border-dark">
        <div className="flex border-b border-border-light bg-gray-50 dark:border-border-dark dark:bg-gray-800/50">
          <button
            type="button"
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'write'
                ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'text-text-secondary-light hover:bg-gray-100 hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:bg-gray-800 dark:hover:text-text-primary-dark'
            }`}
            onClick={() => setActiveTab('write')}
          >
            {t('createBlog.write')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'preview'
                ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'text-text-secondary-light hover:bg-gray-100 hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:bg-gray-800 dark:hover:text-text-primary-dark'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            {t('createBlog.preview')}
          </button>
        </div>

        {activeTab === 'write' ? (
          <div className="flex flex-col relative">
            <div className="flex flex-wrap gap-1 border-b border-border-light bg-background-light p-1 dark:border-border-dark dark:bg-background-dark">
              {formattingOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={option.action}
                  title={option.title}
                  className="rounded p-1.5 text-text-secondary-light hover:bg-gray-100 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-gray-800 dark:hover:text-primary-400"
                >
                  {option.icon}
                </button>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              placeholder={t('createBlog.contentPlaceholder')}
              className={`min-h-[200px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-text-primary-light focus:outline-none dark:text-text-primary-dark`}
              value={content}
              onChange={e => setContent(e.target.value)}
              onSelect={handleSelect}
              dir="auto"
            ></textarea>

            {selectionToolbar && (
              <div
                className="fixed z-100 flex items-center gap-1 rounded-lg bg-surface-light p-1 shadow-xl ring-1 ring-border-light dark:bg-surface-dark dark:ring-border-dark animate-in fade-in zoom-in-95 duration-200"
                style={{
                  left: `${selectionToolbar.x}px`,
                  top: `${selectionToolbar.y}px`,
                  transform: 'translateX(-50%)',
                }}
              >
                {formattingOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      option.action();
                    }}
                    className="rounded p-1.5 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-800 dark:hover:text-primary-400"
                  >
                    {option.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="prose prose-slate dark:prose-invert min-h-[200px] max-w-none overflow-y-auto p-4 sm:p-6">
            <MyMarkdown markdown={content || `*${t('createBlog.nothingToPreview')}*`} />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          onClick={handleSubmit}
          disabled={createBlogMutation.isLoading || !title.trim() || !content.trim()}
        >
          {createBlogMutation.isLoading ? t('createBlog.publishing') : t('createBlog.publish')}
        </button>
      </div>
    </div>
  );
};
