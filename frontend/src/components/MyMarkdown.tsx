import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'src/context/ThemeContext';

import { isArabic } from '../utils/assists';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';

export const MyMarkdown: FC<{ markdown: string }> = ({ markdown }) => {
  const { isDarkMode } = useTheme();
  const components: Components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className?.includes('language-');
      const language = match ? match[1] : '';
      const codeContent = String(children).replace(/\n$/, '');

      // Handle Mermaid diagrams
      if (language === 'mermaid') {
        return <MermaidDiagram chart={codeContent} isDark={isDarkMode} />;
      }

      if (!isInline && match) {
        return <CodeBlock language={language}>{codeContent}</CodeBlock>;
      }

      return (
        <code
          className={className}
          style={{
            background: 'var(--inline-code-background)',
            borderRadius: 'var(--border-radius-sm)',
            fontFamily: 'var(--font-family-mono)',
            fontSize: '0.9em',
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            maxWidth: '100%',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
          {...props}
        >
          {children}
        </code>
      );
    },

    table: ({ ...props }) => (
      <div style={{ overflowX: 'auto', margin: 'var(--spacing-lg) 0' }}>
        <table {...props} style={{ width: '100%', borderCollapse: 'collapse' }} />
      </div>
    ),
    th: ({ ...props }) => (
      <th
        {...props}
        style={{
          padding: 'var(--spacing-sm)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg-surface)',
          fontWeight: '600',
        }}
      />
    ),
    td: ({ ...props }) => (
      <td
        {...props}
        style={{
          padding: 'var(--spacing-sm)',
          border: '1px solid var(--color-border)',
        }}
      />
    ),
  };

  return (
    <div className={`markdown-content ${isArabic(markdown) ? 'arabic' : 'english'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
