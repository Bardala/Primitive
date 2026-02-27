import { isArabic } from '@/core/utils';

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiBold, 
  FiCode, 
  FiImage, 
  FiItalic, 
  FiLink, 
  FiList, 
  FiType,
  FiSave,
  FiEye,
  FiEdit3,
  FiHash,
  FiBookOpen,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { MdFormatQuote, MdClose, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { MyMarkdown } from './MyMarkdown';
import { useCreateBlog } from '../hooks/useBlog';
import { useUserSeries } from '../hooks/useSeries';
import { useTheme } from '@/core/context';

export const BlogForm: React.FC = () => {
  const { spaceId, spaceName } = useParams();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showMetaPanel, setShowMetaPanel] = useState(()=> window.innerWidth >= 768);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const { data: userSeries } = useUserSeries();
  const { createBlogMutation } = useCreateBlog(
    spaceId!,
    title,
    content,
    selectedSeriesId || undefined,
    tags.length > 0 ? tags : undefined
  );

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

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    e.preventDefault();
    createBlogMutation.mutate();
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
    { icon: <FiBold size={18} />, action: () => wrapSelection('**', '**'), title: t('createBlog.bold') },
    { icon: <FiItalic size={18} />, action: () => wrapSelection('*', '*'), title: t('createBlog.italic') },
    {
      icon: <FiLink size={18} />,
      action: () => insertAtCursor('[link text](https://)'),
      title: t('createBlog.insertLink'),
    },
    { icon: <FiCode size={18} />, action: () => wrapSelection('`', '`'), title: t('createBlog.inlineCode') },
    {
      icon: <FiImage size={18} />,
      action: () => insertAtCursor('![alt text](image-url)'),
      title: t('createBlog.insertImage'),
    },
    { icon: <FiList size={18} />, action: () => insertAtCursor('- List item'), title: t('createBlog.list') },
    { icon: <MdFormatQuote size={18} />, action: () => insertAtCursor('> '), title: t('createBlog.quote') },
    {
      icon: <FiType size={18} />,
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setActiveTab(activeTab === 'write' ? 'preview' : 'write');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, content, title, tags, selectedSeriesId]);

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
          {/* <p>• <span className="font-mono">Ctrl/Cmd + S</span> {t('createBlog.saveTip')}</p> */}
          <p>• <span className="font-mono">Ctrl/Cmd + P</span> {t('createBlog.previewTip')}</p>
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
            <MdClose size={20} className="text-text-secondary-light dark:text-text-secondary-dark sm:size-22" />
          </button>
          <div className="h-5 w-px bg-border-light dark:bg-border-dark sm:h-6" />
          <div className="flex items-center gap-1 sm:gap-2">
            {/* <span className="hiddefn text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark sm:inline sm:text-sm">
              {t('createBlog.draft')}
            </span> */}
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
            onClick={handleSubmit}
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
                <FiX size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />
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
              className={`w-full border-none bg-transparent text-2xl font-bold text-text-primary-light placeholder-text-secondary-light/50 outline-none focus:ring-0 dark:text-text-primary-dark dark:placeholder-text-secondary-dark/50 sm:text-3xl lg:text-4xl ${
                isArabic(title) ? 'text-right' : 'text-left'
              }`}
              type="text"
              value={title}
              placeholder={t('createBlog.fullScreenTitlePlaceholder')}
              onChange={e => setTitle(e.target.value)}
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
                    className="rounded p-1.5 text-text-secondary-light hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10 dark:hover:text-primary-400 sm:p-2"
                  >
                    {option.icon}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`rounded p-1.5 sm:p-2 ${
                      activeTab === 'write'
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-text-secondary-light hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10'
                    }`}
                    title={t('createBlog.write')}
                  >
                    <FiEdit3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`rounded p-1.5 sm:p-2 ${
                      activeTab === 'preview'
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-text-secondary-light hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-white/10'
                    }`}
                    title={t('createBlog.preview')}
                  >
                    <FiEye size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Editor/Preview Area */}
            {activeTab === 'write' ? (
              <textarea
                ref={textareaRef}
                placeholder={t('createBlog.fullScreenContentPlaceholder')}
                className={`min-h-[calc(100vh-250px)] w-full resize-none border-none bg-transparent font-mono text-sm leading-relaxed text-text-primary-light outline-none focus:ring-0 dark:text-text-primary-dark sm:text-base ${
                  isArabic(content) ? 'text-right' : 'text-left'
                }`}
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert min-h-[calc(100vh-250px)] max-w-none sm:prose-base">
                <MyMarkdown markdown={content || `*${t('createBlog.nothingToPreview')}*`} />
              </div>
            )}
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