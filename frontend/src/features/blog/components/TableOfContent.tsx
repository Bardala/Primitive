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
    <div className="table-of-contents">
      <div className="toc-header">
        <h3>{t('blogDetails.tableOfContents')}</h3>
        <button onClick={toggle} className="toc-close-btn">
          ×
        </button>
      </div>

      <ul>
        {headings.map((heading, index) => (
          <li
            key={heading.id + index}
            className={`toc-level-${heading.level}`}
            style={{ marginLeft: `${(heading.level - 1) * 16}px` }}
          >
            <button onClick={() => scrollTo(heading.id)} className="toc-link">
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const TableOfContents = memo(TableOfContentsComponent);
