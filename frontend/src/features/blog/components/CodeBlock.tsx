import { useTheme } from '@/core/context';

import { FC, useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const CodeBlock: FC<{ language: string; children: string }> = ({ language, children }) => {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border-light bg-[#f9f9f9] dark:border-border-dark dark:bg-[#1e1e1e]">
      {/* Header with Language and Copy Button */}
      <div className="flex items-center justify-between bg-gray-100/50 px-4 py-2 dark:bg-black/20">
        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-xs font-bold text-text-secondary-light shadow-sm ring-1 ring-border-light transition-all hover:bg-primary-50 hover:text-primary-600 dark:bg-surface-dark dark:text-text-secondary-dark dark:ring-border-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
          title="Copy Code"
        >
          {copied ? (
            <>
              <FiCheck className="text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FiCopy />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <SyntaxHighlighter
          style={isDarkMode ? vscDarkPlus : oneLight}
          language={language}
          PreTag="div"
          showLineNumbers={true}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'inherit',
            },
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
