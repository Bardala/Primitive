import { memo } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  headings: Heading[];
  show: boolean;
  toggle: () => void;
  scrollTo: (id: string) => void;
  t: (key: string, opts?: any) => string;
}

const TableOfContentsComponent = ({ headings, show, toggle, scrollTo, t }: Props) => {
  if (!show) return null;

  return (
    <div className="rounded-xl border border-border-light bg-surface-light p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <div className="mb-3 flex items-center justify-between border-b border-border-light pb-2 dark:border-border-dark">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          {t('blogDetails.tableOfContents')}
        </h3>
        <button
          onClick={toggle}
          className="flex h-6 w-6 items-center justify-center rounded text-text-secondary-light hover:bg-gray-100 hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:bg-gray-800 dark:hover:text-text-primary-dark"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <ul className="flex flex-col gap-1">
        {headings.map((heading, index) => {
          const paddingLeft = (heading.level - 1) * 16;

          return (
            <li key={heading.id + index} style={{ paddingLeft: `${paddingLeft}px` }}>
              <button
                onClick={() => scrollTo(heading.id)}
                className={`w-full text-left text-sm transition-colors hover:text-primary-600 hover:underline dark:hover:text-primary-400 ${
                  heading.level <= 2
                    ? 'font-medium text-text-primary-light dark:text-text-primary-dark'
                    : 'text-text-secondary-light dark:text-text-secondary-dark'
                }`}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const TableOfContents = memo(TableOfContentsComponent);
