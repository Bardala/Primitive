import { useTheme } from '@/core/context';
import { isArabic } from '@/core/utils';

import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import { Link } from 'react-router-dom';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';

export const MyMarkdown: FC<{ markdown: string }> = ({ markdown }) => {
  const { isDarkMode } = useTheme();

  // Pre-process markdown to turn @username into mentions
  const processedMarkdown = markdown.replace(/@(\w+)/g, '[@$1](/u/$1)');

  const components: Components = {
    a: ({ href, children, ...props }) => {
      const isMention = href?.startsWith('/u/');
      if (isMention) {
        return (
          <Link
            to={href!}
            className="rounded-md bg-yellow-100 px-1.5 py-0.5 text-sm font-bold text-yellow-700 no-underline transition-colors hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          className="font-bold text-primary-600 no-underline decoration-primary-500/30 decoration-2 underline-offset-4 transition-all hover:text-primary-700 hover:underline dark:text-primary-400 dark:decoration-primary-400/30 dark:hover:text-primary-300"
          {...props}
        >
          {children}
        </a>
      );
    },
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className?.includes('language-');
      const language = match ? match[1] : '';
      const codeContent = String(children).replace(/\n$/, '');

      if (language === 'mermaid') {
        return <MermaidDiagram chart={codeContent} isDark={isDarkMode} />;
      }

      if (!isInline && match) {
        return <CodeBlock language={language}>{codeContent}</CodeBlock>;
      }

      return (
        <code
          className="rounded-lg bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] font-bold text-red-500 transition-colors dark:bg-white/5 dark:text-red-400"
          {...props}
        >
          {children}
        </code>
      );
    },

    table: ({ ...props }) => (
      <div className="my-8 overflow-x-auto rounded-2xl border border-border-light shadow-sm dark:border-border-dark">
        <table className="w-full border-collapse text-left text-sm" {...props} />
      </div>
    ),
    thead: ({ ...props }) => <thead className="bg-gray-50 dark:bg-white/5" {...props} />,
    th: ({ ...props }) => (
      <th
        className="border-b border-border-light px-4 py-3 font-bold text-text-primary-light dark:border-border-dark dark:text-text-primary-dark"
        {...props}
      />
    ),
    td: ({ ...props }) => (
      <td
        className="border-b border-border-light px-4 py-3 text-text-secondary-light dark:border-border-dark dark:text-text-secondary-dark"
        {...props}
      />
    ),
    blockquote: ({ ...props }) => (
      <blockquote
        className="my-6 border-l-4 border-primary-500 bg-primary-50/30 py-2 pr-4 pl-6 italic text-text-secondary-light dark:bg-primary-900/10 dark:text-text-secondary-dark"
        {...props}
      />
    ),
  };

  return (
    <div
      className={`prose prose-neutral max-w-none dark:prose-invert prose-headings:font-extrabold prose-headings:tracking-tight prose-a:font-bold prose-img:rounded-2xl prose-img:shadow-lg 
        ${isArabic(markdown) ? 'text-right [direction:rtl]' : 'text-left [direction:ltr]'}`
    }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
        components={components}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
};
