import mermaid from 'mermaid';
import { FC, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'src/context/ThemeContext';

import { isArabic } from '../utils/assists';

// Initialize Mermaid
// mermaid.initialize({
//   startOnLoad: false,
//   theme: 'dark',
//   securityLevel: 'loose',
//   fontFamily: 'var(--font-family-mono)',
//   logLevel: 0,
//   suppressErrorRendering: true,
// });

interface MermaidDiagramProps {
  chart: string;
  isDark: boolean;
}

// Mermaid component
const MermaidDiagram: FC<MermaidDiagramProps> = ({ chart, isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      const container = containerRef.current;

      // Clear previous content
      container.innerHTML = '';

      // Re-initialize Mermaid with current theme
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default', // 👈 change theme dynamically
        securityLevel: 'loose',
        fontFamily: 'var(--font-family-mono)',
        logLevel: 0,
        suppressErrorRendering: true,
      });

      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

      mermaid
        .render(id, chart)
        .then(({ svg }) => {
          container.innerHTML = svg;
        })
        .catch(error => {
          console.error('Mermaid rendering error:', error);
          container.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; border-radius: var(--border-radius-md);">
          Mermaid diagram error: ${error instanceof Error ? error.message : String(error)}
        </div>`;
        });
    }
  }, [chart, isDark]);

  return (
    <div
      ref={containerRef}
      style={{
        background: 'var(--code-block-background)',
        border: '1px solid var(--code-block-border)',
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--spacing-md)',
        margin: 'var(--spacing-lg) 0',
        overflowX: 'auto',
        textAlign: 'center',
      }}
    />
  );
};

const CodeBlock: FC<{ language: string; children: string }> = ({ language, children }) => {
  const { isDarkMode } = useTheme();
  return (
    <div style={{ position: 'relative' }}>
      <SyntaxHighlighter
        style={isDarkMode ? vscDarkPlus : oneLight} // 👈 switch dynamically
        language={language}
        PreTag="div"
        showLineNumbers={true}
        wrapLongLines={false}
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

    // h1: ({ ...props }) => <h1 style={{ scrollMarginTop: '80px' }} {...props} />,
    // h2: ({ ...props }) => <h2 style={{ scrollMarginTop: '80px' }} {...props} />,
    // h3: ({ ...props }) => <h3 style={{ scrollMarginTop: '80px' }} {...props} />,

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
