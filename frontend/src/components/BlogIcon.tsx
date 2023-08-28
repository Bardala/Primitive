import { Blog } from '@nest/shared';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

import { isArabic } from '../utils/assists';
import { LikeBlogButton } from './LikeBlogButton';

export const BlogIcon: React.FC<{ post: Blog }> = ({ post }) => {
  return (
    <div className="blog-preview" key={post.id}>
      <div className="blog-content">
        <Link to={`/b/${post.id}`} className="blog-link">
          <div className="blog-header">
            <h2>{post.title}</h2>
          </div>
        </Link>

        <div className="blog-meta">
          <Link to={`/u/${post.userId}`} className="author-link">
            <strong>{post.author}</strong>
          </Link>

          <LikeBlogButton post={post} />

          {post.spaceId !== '1' && (
            <Link to={`/space/${post?.spaceId}`} className="space-link">
              Spaced
            </Link>
          )}
          <time className="created-at" dateTime={String(post.timestamp)}>
            {formatDistanceToNow(new Date(post.timestamp as number))}
          </time>
        </div>

        <div className="blog-excerpt">
          <p className={isArabic(post.content) ? 'arabic' : ''}>{post.content}</p>
        </div>
      </div>
    </div>
  );
};
