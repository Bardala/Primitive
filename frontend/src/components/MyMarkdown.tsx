import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { isArabic } from '../utils/assists';

// Wrapper component with responsive settings
const CodeBlock: FC<{ language: string; children: string }> = ({ language, children }) => {
  return (
    <div style={{ position: 'relative' }}>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        showLineNumbers={true}
        wrapLongLines={false} // Changed to false to prevent awkward breaks
        lineProps={{ style: { whiteSpace: 'pre' } }}
        customStyle={{
          background: 'var(--code-block-background)',
          border: '1px solid var(--code-block-border)',
          borderRadius: 'var(--border-radius-md)',
          fontSize: '0.9rem',
          margin: 'var(--spacing-lg) 0',
          overflowX: 'auto',
          maxWidth: '100%',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export const MyMarkdown: FC<{ markdown: string }> = ({ markdown }) => {
  const components: Components = {
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className?.includes('language-');

      if (!isInline && match) {
        return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>;
      }

      return (
        <code
          className={className}
          style={{
            background: 'var(--inline-code-background)',
            // padding: '0.2em 0.4em',
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

    // ... keep your other components the same
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h1: ({ ...props }) => <h1 style={{ scrollMarginTop: '80px' }} {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h2: ({ ...props }) => <h2 style={{ scrollMarginTop: '80px' }} {...props} />,
    // eslint-disable-next-line jsx-a11y/heading-has-content
    h3: ({ ...props }) => <h3 style={{ scrollMarginTop: '80px' }} {...props} />,

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
