import { formatTimeShort, isArabic } from '@/core/utils';
import { UserLink } from '@/features/user';

import { Blog, DefaultSpaceId } from '@nest/shared';

import { useTranslation } from 'react-i18next';
import { LiaCommentSolid } from 'react-icons/lia';
import { RiGroup2Fill } from 'react-icons/ri';
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

          {post.spaceId !== DefaultSpaceId && (
            <Link to={`/space/${post?.spaceId}`} className="space-link" title={t('blog.space')}>
              <RiGroup2Fill size={20} />
            </Link>
          )}

          <time className="created-at" dateTime={String(post.timestamp)}>
            {formatTimeShort(new Date(post.timestamp!))}
          </time>
        </div>

        {viewMode === 'full-blogs' && (
          <div className="blog-excerpt">
            <MyMarkdown markdown={post.content} />
          </div>
        )}
      </div>
    </div>
  );
};
