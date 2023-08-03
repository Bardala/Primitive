import { Blog } from '@nest/shared';
import { formatDistanceToNow } from 'date-fns';
import Markdown from 'markdown-to-jsx';
import { Link } from 'react-router-dom';

import { isArabic } from '../assists';
import { LikeBlogButton } from './LikeBlogButton';

export const BlogIcon: React.FC<{ blog: Blog }> = ({ blog }) => {
  return (
    <div className="blog-preview" key={blog.id}>
      <div className="blog-content">
        <Link to={`/b/${blog.id}`} className="blog-link">
          <div className="blog-header">
            <h2>{blog.title}</h2>
          </div>
        </Link>

        <div className="blog-meta">
          <Link to={`/u/${blog.userId}`} className="author-link">
            <strong>{blog.author}</strong>
          </Link>

          <LikeBlogButton blog={blog} />

          {blog.spaceId !== '1' && (
            <Link to={`/space/${blog?.spaceId}`} className="space-link">
              Spaced
            </Link>
          )}
          <time className="created-at" dateTime={String(blog.timestamp)}>
            {formatDistanceToNow(new Date(blog.timestamp as number))}
          </time>
        </div>

        <div className="blog-excerpt">
          <p className={isArabic(blog.content) ? 'arabic' : ''}>
            <Markdown>
              {blog.content.length > 5000 ? blog.content.slice(0, 5000) + '...' : blog.content}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  );
};
