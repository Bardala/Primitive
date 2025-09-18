import { FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'src/context/ThemeContext';

export const CodeBlock: FC<{ language: string; children: string }> = ({ language, children }) => {
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
