import { formatTimeShort, isArabic } from '@/core/utils';
import { UserLink } from '@/features/user';

import { Blog, DefaultSpaceId } from '@nest/shared';

import { useTranslation } from 'react-i18next';
import { LiaCommentSolid } from 'react-icons/lia';
import { RiGroup2Fill, RiStackLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';

import { useCommCounts } from '../hooks/useBlog';
import { LikeBlogButton } from './LikeBlogButton';
import { MyMarkdown } from './MyMarkdown';

interface BlogIconProps {
  post: Blog;
  viewMode: 'titles-only' | 'full-blogs';
}

export const BlogIcon: React.FC<BlogIconProps> = ({ post, viewMode }) => {
  const { numOfComments } = useCommCounts(post.id!);
  const nav = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className={`blog-preview ${viewMode === 'titles-only' ? 'titles-only' : ''}`}
      key={post.id}
    >
      <div className="blog-content">
        <div className="blog-header">
          <Link to={`/b/${post.id}`} className="blog-link">
            <h2 className={isArabic(post.title) ? 'arabic' : 'english'}>{post.title}</h2>
          </Link>
        </div>

        <div className="blog-meta">
          <UserLink userId={post.userId!} username={post.author!} complete={false} />

          <LikeBlogButton post={post} />

          <span
            className="comms-count"
            onClick={() => nav(`/b/${post.id}#comments`)}
            title={t('blog.comments')}
          >
            {numOfComments.data?.numOfComments} <LiaCommentSolid size={20} />
          </span>

          {post.space && post.spaceId !== DefaultSpaceId && (
            <Link to={`/space/${post.spaceId}`} className="space-link" title={t('blog.space')}>
              <RiGroup2Fill size={18} />
              <span className="meta-text">{post.space.name}</span>
            </Link>
          )}

          {post.seriesLinks && post.seriesLinks.length > 0 && post.seriesLinks[0].series && (
            <Link
              to={`/series/${post.seriesLinks[0].series.id}`}
              className="series-link"
              title={t('blog.series')}
            >
              <RiStackLine size={18} />
              <span className="meta-text">{post.seriesLinks[0].series.name}</span>
            </Link>
          )}

          <time className="created-at" dateTime={String(post.timestamp)}>
            {formatTimeShort(Number(post.timestamp))}
          </time>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="tags-container">
            {post.tags.map(tag => (
              <Link key={tag.id} to={`/tag/${tag.id}`} className="tag-link">
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {viewMode === 'full-blogs' && (
          <div className="blog-excerpt">
            <MyMarkdown markdown={post.content} />
          </div>
        )}
      </div>
    </div>
  );
};
