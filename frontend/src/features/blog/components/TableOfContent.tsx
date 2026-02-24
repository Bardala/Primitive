import { memo } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
  activeId?: string;
  scrollTo: (id: string) => void;
  t: (key: string, opts?: any) => string;
  className?: string;
}

const TableOfContentsComponent = ({ headings, activeId, scrollTo, t, className = '' }: Props) => {
  return (
    <nav className={`flex flex-col ${className}`}>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-[#71767b]">
        {t('blogDetails.tableOfContents') || 'On This Page'}
      </h3>

      <ul className="flex flex-col gap-1 border-l border-border-light dark:border-border-dark/60">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const paddingLeft = heading.level * 12;

          return (
            <li key={heading.id + index}>
              <button
                onClick={() => scrollTo(heading.id)}
                className={`group relative w-full border-l-2 py-1.5 pr-4 text-left text-[13px] transition-all hover:text-primary-600 dark:hover:text-primary-400 ${
                  isActive
                    ? 'border-primary-500 bg-primary-50/50 font-bold text-primary-600 dark:bg-primary-900/10 dark:text-primary-400'
                    : 'border-transparent text-text-secondary-light dark:text-[#71767b]'
                }`}
                style={{ paddingLeft: `${paddingLeft}px` }}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export const TableOfContents = memo(TableOfContentsComponent);
