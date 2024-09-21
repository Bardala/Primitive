import { Blog, DefaultSpaceId } from '@nest/shared';
import { LiaCommentSolid } from 'react-icons/lia';
import { RiGroup2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { useCommCounts } from '../hooks/useBlog';
import { formatTimeShort, isArabic } from '../utils/assists';
import { LikeBlogButton } from './LikeBlogButton';
import { MyMarkdown } from './MyMarkdown';

export const BlogIcon: React.FC<{ post: Blog }> = ({ post }) => {
  const { numOfComments } = useCommCounts(post.id!);

  return (
    <div className="blog-preview" key={post.id}>
      <div className="blog-content">
        <div className="blog-header">
          <Link to={`/b/${post.id}`} className="blog-link">
            <h2 className={isArabic(post.title) ? 'arabic' : ''}>{post.title}</h2>
          </Link>
        </div>

        <div className="blog-meta">
          <Link to={`/u/${post.userId}`} className="author-link">
            <strong>{post.author}</strong>
          </Link>

          <LikeBlogButton post={post} />

          <span className="comms-count">
            {numOfComments.data?.numOfComments} <LiaCommentSolid size={20} />
          </span>

          {post.spaceId !== DefaultSpaceId && (
            <Link to={`/space/${post?.spaceId}`} className="space-link" title="Spaced">
              <RiGroup2Fill size={20} />
            </Link>
          )}

          <time className="created-at" dateTime={String(post.timestamp)}>
            {formatTimeShort(new Date(post.timestamp!))}
          </time>
        </div>

        <div className="blog-excerpt">
          <MyMarkdown markdown={post.content} />
        </div>
      </div>
    </div>
  );
};
