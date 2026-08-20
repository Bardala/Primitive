import { useTheme } from '@/core/context';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiBold,
  FiBookOpen,
  FiCode,
  FiHash,
  FiImage,
  FiItalic,
  FiLink,
  FiList,
  FiMenu,
  FiSave,
  FiType,
  FiX,
} from 'react-icons/fi';
import { MdClose, MdFormatQuote, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { Markdown } from 'tiptap-markdown';

import { useCreateBlog } from '../hooks/useBlog';
import { useUserSeries } from '../hooks/useSeries';

export const BlogForm: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string; spaceName: string }>();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showMetaPanel, setShowMetaPanel] = useState(() => window.innerWidth >= 768);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const contentRef = useRef(content);
  const { isDarkMode, toggleTheme } = useTheme();

  const { data: userSeries } = useUserSeries();
  const { createBlogMutation } = useCreateBlog(spaceId!);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-lg bg-gray-900 p-4 text-sm font-mono text-gray-100 overflow-x-auto',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            'font-bold text-primary-600 no-underline decoration-primary-500/30 decoration-2 underline-offset-4 transition-all hover:text-primary-700 hover:underline dark:text-primary-400 dark:decoration-primary-400/30 dark:hover:text-primary-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl shadow-lg max-w-full',
        },
      }),
      Placeholder.configure({
        placeholder: t('createBlog.fullScreenContentPlaceholder'),
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-text-secondary-light/50 dark:before:text-text-secondary-dark/50 before:float-left before:h-0 before:pointer-events-none',
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const md = (editor.storage as any).markdown.getMarkdown();
      contentRef.current = md;
      setContent(md);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[calc(100vh-250px)] outline-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:font-bold prose-img:rounded-2xl prose-img:shadow-lg prose-code:rounded-lg prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-bold prose-code:text-red-500 dark:prose-code:bg-white/5 dark:prose-code:text-red-400 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/30 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:pl-6 prose-blockquote:italic dark:prose-blockquote:bg-primary-900/10',
        dir: 'auto',
      },
    },
  });

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setReadTime(Math.ceil(words / 200));
  }, [content]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handlePublish = useCallback(
    (e: KeyboardEvent | FormEvent) => {
      e.preventDefault();
      createBlogMutation.mutate({
        title,
        spaceId: spaceId!,
        content: contentRef.current,
        seriesId: selectedSeriesId || undefined,
        tagNames: tags.length > 0 ? tags : undefined,
      });
    },
    [title, spaceId, selectedSeriesId, tags, createBlogMutation]
  );

  // Toolbar actions using TipTap commands
  const formattingOptions = [
    {
      icon: <FiBold size={18} />,
      action: () => editor?.chain().focus().toggleBold().run(),
      title: t('createBlog.bold'),
      isActive: () => editor?.isActive('bold'),
    },
    {
      icon: <FiItalic size={18} />,
      action: () => editor?.chain().focus().toggleItalic().run(),
      title: t('createBlog.italic'),
      isActive: () => editor?.isActive('italic'),
    },
    {
      icon: <FiLink size={18} />,
      action: () => {
        if (editor?.isActive('link')) {
          editor.chain().focus().unsetLink().run();
        } else {
          const url = window.prompt('URL');
          if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
          }
        }
      },
      title: t('createBlog.insertLink'),
      isActive: () => editor?.isActive('link'),
    },
    {
      icon: <FiCode size={18} />,
      action: () => editor?.chain().focus().toggleCode().run(),
      title: t('createBlog.inlineCode'),
      isActive: () => editor?.isActive('code'),
    },
    {
      icon: <FiImage size={18} />,
      action: () => {
        const url = window.prompt('Image URL');
        if (url) {
          editor?.chain().focus().setImage({ src: url }).run();
        }
      },
      title: t('createBlog.insertImage'),
      isActive: () => false,
    },
    {
      icon: <FiList size={18} />,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      title: t('createBlog.list'),
      isActive: () => editor?.isActive('bulletList'),
    },
    {
      icon: <MdFormatQuote size={18} />,
      action: () => editor?.chain().focus().toggleBlockquote().run(),
      title: t('createBlog.quote'),
      isActive: () => editor?.isActive('blockquote'),
    },
    {
      icon: <FiType size={18} />,
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
      title: t('createBlog.codeBlock'),
      isActive: () => editor?.isActive('codeBlock'),
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handlePublish(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, title, tags, selectedSeriesId, handlePublish]);

  // Metadata Panel Content Component
  const MetadataPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
          {t('createBlog.writingDetails')}
        </h3>

        {/* Series Selection */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {t('createBlog.series')}
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

          {/* Tags */}
          <div>
            <label className="mb-1 block flex items-center gap-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
              <FiHash size={14} />
              {t('createBlog.tags')}
            </label>
            <div className="flex flex-wrap gap-1 rounded-lg border border-border-light bg-background-light p-2 focus-within:border-primary-600 dark:border-border-dark dark:bg-background-dark">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-red-500"
                  >
                    <MdClose size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={t('createBlog.addTag')}
                className="flex-1 bg-transparent p-1 text-xs outline-none placeholder:text-text-secondary-light/50 dark:placeholder:text-text-secondary-dark/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
          {t('createBlog.stats')}
        </h3>
        <div className="space-y-2 rounded-lg bg-background-light p-3 dark:bg-background-dark">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary-light dark:text-text-secondary-dark">
              {t('createBlog.words')}
            </span>
            <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
              {wordCount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary-light dark:text-text-secondary-dark">
              {t('createBlog.readingTime')}
            </span>
            <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
              {readTime} min
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary-light dark:text-text-secondary-dark">
              {t('createBlog.characters')}
            </span>
            <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
              {content.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
          {t('createBlog.tips')}
        </h3>
        <div className="space-y-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          <p>
            • <span className="font-mono">Ctrl/Cmd + B</span> {t('createBlog.bold')}
          </p>
          <p>
            • <span className="font-mono">Ctrl/Cmd + I</span> {t('createBlog.italic')}
          </p>
          <p>• {t('createBlog.markdownTip')}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-light dark:bg-surface-dark">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border-light px-3 dark:border-border-dark sm:px-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary-50 dark:hover:bg-white/10 sm:h-9 sm:w-9"
          >
            <MdClose
              size={20}
              className="text-text-secondary-light dark:text-text-secondary-dark sm:size-22"
            />
          </button>
          <div className="h-5 w-px bg-border-light dark:bg-border-dark sm:h-6" />
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 sm:px-2 sm:py-0.5 sm:text-xs">
              {wordCount} {t('createBlog.words')} · {readTime} min
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary-light hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10 sm:hidden"
          >
            <FiMenu size={20} />
          </button>

          {/* Desktop Details Button */}
          <button
            onClick={() => setShowMetaPanel(!showMetaPanel)}
            className={`hidden h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors sm:flex ${
              showMetaPanel
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'text-text-secondary-light hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10'
            }`}
          >
            <FiBookOpen size={18} />
            <span className="hidden sm:inline">{t('createBlog.details')}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary-light hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10 sm:h-9 sm:w-9"
          >
            {isDarkMode ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />}
          </button>

          <div className="h-5 w-px bg-border-light dark:bg-border-dark sm:h-6" />

          <button
            type="button"
            onClick={handlePublish}
            disabled={createBlogMutation.isLoading || !title.trim() || !content.trim()}
            className="flex h-8 items-center gap-1 rounded-lg bg-primary-600 px-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed sm:h-9 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <FiSave size={16} />
            <span className="hidden sm:inline">
              {createBlogMutation.isLoading ? t('createBlog.publishing') : t('createBlog.publish')}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm sm:hidden">
          <div className="absolute right-0 top-0 h-full w-80 max-w-[80%] bg-surface-light shadow-xl dark:bg-surface-dark">
            <div className="flex h-14 items-center justify-between border-b border-border-light px-4 dark:border-border-dark">
              <h2 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                {t('createBlog.writingDetails')}
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-primary-50 dark:hover:bg-white/10"
              >
                <FiX
                  size={20}
                  className="text-text-secondary-light dark:text-text-secondary-dark"
                />
              </button>
            </div>
            <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-4">
              <MetadataPanel />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className={`flex-1 overflow-auto ${showMetaPanel ? 'hidden sm:block' : ''}`}>
          <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            {/* Title Input */}
            <input
              className={`w-full border-none bg-transparent text-2xl font-bold text-text-primary-light placeholder-text-secondary-light/50 outline-none focus:ring-0 dark:text-text-primary-dark dark:placeholder-text-secondary-dark/50 sm:text-3xl lg:text-4xl`}
              type="text"
              value={title}
              placeholder={t('createBlog.fullScreenTitlePlaceholder')}
              onChange={e => setTitle(e.target.value)}
              dir="auto"
              autoFocus
            />

            {/* Formatting Toolbar - Scrollable on mobile */}
            <div className="sticky top-0 z-10 -mx-2 mb-4 mt-4 overflow-x-auto sm:mt-6">
              <div className="flex w-max min-w-full items-center gap-1 rounded-lg bg-surface-light/95 px-2 py-2 backdrop-blur-sm dark:bg-surface-dark/95 sm:w-auto">
                {formattingOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={option.action}
                    title={option.title}
                    className={`rounded p-1.5 sm:p-2 transition-colors ${
                      option.isActive?.()
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-text-secondary-light hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10 dark:hover:text-primary-400'
                    }`}
                  >
                    {option.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* WYSIWYG Editor */}
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Desktop Metadata Panel */}
        {showMetaPanel && (
          <div className="hidden w-80 overflow-y-auto border-l border-border-light bg-gray-50/50 p-4 dark:border-border-dark dark:bg-gray-900/20 sm:block">
            <MetadataPanel />
          </div>
        )}
      </div>
    </div>
  );
};
