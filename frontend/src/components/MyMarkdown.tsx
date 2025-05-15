import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus, vs, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { dark as board } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { isArabic } from '../utils/assists';

export const MyMarkdown: FC<{ markdown: string }> = ({ markdown }) => {
  return (
    <article className={isArabic(markdown) ? 'arabic' : ''}>
      <ReactMarkdown
        children={markdown}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={board}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
    </article>
  );
};
