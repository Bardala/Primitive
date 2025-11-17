import { isArabic } from '@/core/utils';

import { FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBold, FiCode, FiImage, FiItalic, FiLink, FiList, FiType } from 'react-icons/fi';
import { MdFormatQuote } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { MyMarkdown } from '../components/MyMarkdown';
import { useCreateBlog } from '../hooks/useBlog';

import '../styles/create-blog-page.css';

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
    <div className="create-blog-container">
      <h2>
        {t('createBlog.addNew')} <i>{spaceName}</i> {t('createBlog.space')}
      </h2>

      {createBlogMutation.isError && (
        <div className="error-message">{createBlogMutation.error.message}</div>
      )}

      <div className="create-blog-form">
        <div className="title-section">
          <input
            className={`title-input ${isArabic(title) ? 'arabic' : 'english'}`}
            type="text"
            required
            value={title}
            placeholder={t('createBlog.titlePlaceholder')}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="editor-container">
          <div className="editor-tabs">
            <button
              className={activeTab === 'write' ? 'active' : ''}
              onClick={() => setActiveTab('write')}
            >
              {t('createBlog.write')}
            </button>
            <button
              className={activeTab === 'preview' ? 'active' : ''}
              onClick={() => setActiveTab('preview')}
            >
              {t('createBlog.preview')}
            </button>
          </div>

          {activeTab === 'write' ? (
            <div className="markdown-editor">
              <div className="toolbar">
                {formattingOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={option.action}
                    title={option.title}
                    className="format-button"
                  >
                    {option.icon}
                  </button>
                ))}
              </div>

              <textarea
                ref={textareaRef}
                placeholder={t('createBlog.contentPlaceholder')}
                className={`content-textarea ${isArabic(content) ? 'arabic' : 'english'}`}
                value={content}
                onChange={e => setContent(e.target.value)}
              ></textarea>

              <div className="markdown-cheatsheet">
                <h4>{t('createBlog.markdownReference')}</h4>
                <ul>
                  <li>
                    <strong>**{t('createBlog.bold')}**</strong> - <code>**text**</code>
                  </li>
                  <li>
                    <em>*{t('createBlog.italic')}*</em> - <code>*text*</code>
                  </li>
                  <li>
                    <code>`{t('createBlog.inlineCode')}`</code> - <code>`code`</code>
                  </li>
                  <li>
                    # {t('createBlog.heading1')} - <code># Heading</code>
                  </li>
                  <li>
                    ## {t('createBlog.heading2')} - <code>## Heading</code>
                  </li>
                  <li>
                    [{t('createBlog.link')}]({t('createBlog.url')}) - <code>[text](url)</code>
                  </li>
                  <li>
                    ![{t('createBlog.image')}]({t('createBlog.url')}) - <code>![alt](url)</code>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="markdown-preview">
              <MyMarkdown markdown={content || `*${t('createBlog.nothingToPreview')}*`} />
            </div>
          )}
        </div>

        <div className="actions">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={createBlogMutation.isLoading || !title.trim() || !content.trim()}
          >
            {createBlogMutation.isLoading ? t('createBlog.publishing') : t('createBlog.publish')}
          </button>
        </div>
      </div>
    </div>
  );
};
