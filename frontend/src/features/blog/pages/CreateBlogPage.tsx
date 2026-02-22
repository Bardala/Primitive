import { MainLayout } from '@/app/layout';
import { isArabic } from '@/core/utils';

import { FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBold, FiCode, FiImage, FiItalic, FiLink, FiList, FiType } from 'react-icons/fi';
import { MdFormatQuote } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { MyMarkdown } from '../components/MyMarkdown';
import { useCreateBlog } from '../hooks/useBlog';

// import '../styles/create-blog-page.css';

export const CreateBlogPage: React.FC = () => {
  const { spaceId, spaceName } = useParams();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { createBlogMutation } = useCreateBlog(spaceId!, title, content);

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createBlogMutation.mutate();
    if (createBlogMutation.isSuccess) {
      setTitle('');
      setContent('');
    }
  };

  // Markdown formatting helpers
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

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {t('createBlog.addNew')}{' '}
          <i className="text-primary-600 dark:text-primary-400">{spaceName}</i>{' '}
          {t('createBlog.space')}
        </h2>

        {createBlogMutation.isError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {createBlogMutation.error?.message}
          </div>
        )}

        <div className="rounded-xl border border-border-light bg-surface-light p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark sm:p-8">
          <div className="mb-6">
            <input
              className={`w-full rounded-lg border border-border-light bg-background-light p-4 text-2xl font-bold text-text-primary-light placeholder-text-secondary-light focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 dark:border-border-dark dark:bg-background-dark dark:text-text-primary-dark dark:placeholder-text-secondary-dark dark:focus:border-primary-400 dark:focus:ring-primary-400 ${
                isArabic(title) ? 'text-right' : 'text-left'
              }`}
              type="text"
              required
              value={title}
              placeholder={t('createBlog.titlePlaceholder')}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-6 overflow-hidden rounded-lg border border-border-light dark:border-border-dark">
            <div className="flex border-b border-border-light bg-gray-50 dark:border-border-dark dark:bg-gray-800/50">
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'write'
                    ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'text-text-secondary-light hover:bg-gray-100 hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:bg-gray-800 dark:hover:text-text-primary-dark'
                }`}
                onClick={() => setActiveTab('write')}
              >
                {t('createBlog.write')}
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-colors ${
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
              <div className="flex flex-col">
                <div className="flex flex-wrap gap-1 border-b border-border-light bg-background-light p-2 dark:border-border-dark dark:bg-background-dark">
                  {formattingOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={option.action}
                      title={option.title}
                      className="rounded p-2 text-text-secondary-light hover:bg-gray-100 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-gray-800 dark:hover:text-primary-400"
                    >
                      {option.icon}
                    </button>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  placeholder={t('createBlog.contentPlaceholder')}
                  className={`min-h-[400px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-text-primary-light focus:outline-none dark:text-text-primary-dark ${
                    isArabic(content) ? 'text-right' : 'text-left'
                  }`}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                ></textarea>

                <div className="border-t border-border-light bg-gray-50 p-4 text-xs text-text-secondary-light dark:border-border-dark dark:bg-gray-800/50 dark:text-text-secondary-dark">
                  <h4 className="mb-2 font-semibold text-primary-600 dark:text-primary-400">
                    {t('createBlog.markdownReference')}
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    <li>
                      <strong>**{t('createBlog.bold')}**</strong> -{' '}
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        **text**
                      </code>
                    </li>
                    <li>
                      <em>*{t('createBlog.italic')}*</em> -{' '}
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        *text*
                      </code>
                    </li>
                    <li>
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        `{t('createBlog.inlineCode')}`
                      </code>{' '}
                      -{' '}
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        `code`
                      </code>
                    </li>
                    <li>
                      # {t('createBlog.heading1')} -{' '}
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        # Heading
                      </code>
                    </li>
                    <li>
                      ## {t('createBlog.heading2')} -{' '}
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        ## Heading
                      </code>
                    </li>
                    <li>
                      [{t('createBlog.link')}]({t('createBlog.url')}) -{' '}
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        [text](url)
                      </code>
                    </li>
                    <li>
                      ![{t('createBlog.image')}]({t('createBlog.url')}) -{' '}
                      <code className="rounded bg-gray-200 px-1 py-0.5 dark:bg-gray-700">
                        ![alt](url)
                      </code>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert min-h-[400px] max-w-none overflow-y-auto p-6">
                <MyMarkdown markdown={content || `*${t('createBlog.nothingToPreview')}*`} />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              className="btn-primary w-full sm:w-auto"
              onClick={handleSubmit}
              disabled={createBlogMutation.isLoading || !title.trim() || !content.trim()}
            >
              {createBlogMutation.isLoading ? t('createBlog.publishing') : t('createBlog.publish')}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
