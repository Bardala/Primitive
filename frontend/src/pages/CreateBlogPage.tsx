import { FormEvent, useRef, useState } from 'react';
import { FiBold, FiCode, FiImage, FiItalic, FiLink, FiList, FiType } from 'react-icons/fi';
import { MdFormatQuote } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { MyMarkdown } from '../components/MyMarkdown';
import { useCreateBlog } from '../hooks/useBlog';
import '../styles/create-blog-page.css';
import { isArabic, preprocessMarkdown } from '../utils/assists';

export const CreateBlogPage: React.FC = () => {
  const { spaceId, spaceName } = useParams();
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

    // Set cursor position after the inserted text
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

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formattingOptions = [
    { icon: <FiBold />, action: () => wrapSelection('**', '**'), title: 'Bold' },
    { icon: <FiItalic />, action: () => wrapSelection('*', '*'), title: 'Italic' },
    {
      icon: <FiLink />,
      action: () => insertAtCursor('[link text](https://)'),
      title: 'Insert Link',
    },
    { icon: <FiCode />, action: () => wrapSelection('`', '`'), title: 'Inline Code' },
    {
      icon: <FiImage />,
      action: () => insertAtCursor('![alt text](image-url)'),
      title: 'Insert Image',
    },
    { icon: <FiList />, action: () => insertAtCursor('- List item'), title: 'Insert List' },
    { icon: <MdFormatQuote />, action: () => insertAtCursor('> '), title: 'Insert Quote' },
    { icon: <FiType />, action: () => wrapSelection('```\n', '\n```'), title: 'Code Block' },
  ];

  return (
    <div className="create-blog-container">
      <h2>
        Add a New Blog to <i>{spaceName}</i> Space
      </h2>

      {createBlogMutation.isError && <p className="error">{createBlogMutation.error.message}</p>}

      {createBlogMutation.isError && (
        <div className="error-message">{createBlogMutation.error.message}</div>
      )}

      <div className="create-blog-form">
        <div className="title-section">
          <input
            className="title-input"
            type="text"
            required
            value={title}
            placeholder="Blog Title"
            onChange={e => setTitle(e.target.value)}
            style={{ direction: isArabic(title) ? 'rtl' : 'ltr' }}
          />
        </div>

        <div className="editor-container">
          <div className="editor-tabs">
            <button
              className={activeTab === 'write' ? 'active' : ''}
              onClick={() => setActiveTab('write')}
            >
              Write
            </button>
            <button
              className={activeTab === 'preview' ? 'active' : ''}
              onClick={() => setActiveTab('preview')}
            >
              Preview
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
                placeholder="Write your blog content in Markdown..."
                className="content-textarea"
                value={content}
                onChange={e => setContent(preprocessMarkdown(e.target.value))}
                style={{ direction: isArabic(content) ? 'rtl' : 'ltr' }}
              ></textarea>

              <div className="markdown-cheatsheet">
                <h4>Markdown Quick Reference</h4>
                <ul>
                  <li>
                    <strong>**Bold**</strong> - <code>**text**</code>
                  </li>
                  <li>
                    <em>*Italic*</em> - <code>*text*</code>
                  </li>
                  <li>
                    <code>`Code`</code> - <code>`code`</code>
                  </li>
                  <li>
                    # Heading 1 - <code># Heading</code>
                  </li>
                  <li>
                    ## Heading 2 - <code>## Heading</code>
                  </li>
                  <li>
                    [Link](url) - <code>[text](url)</code>
                  </li>
                  <li>
                    ![Image](url) - <code>![alt](url)</code>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="markdown-preview">
              <MyMarkdown markdown={content || '*Nothing to preview yet*'} />
            </div>
          )}
        </div>

        <div className="actions">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={createBlogMutation.isLoading || !title.trim() || !content.trim()}
          >
            {createBlogMutation.isLoading ? 'Publishing...' : 'Publish Blog'}
          </button>
        </div>
      </div>
    </div>
  );
};
