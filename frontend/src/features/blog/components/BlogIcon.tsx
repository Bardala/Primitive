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

  const isTitlesOnly = viewMode === 'titles-only';

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border-light bg-surface-light shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-night-deep/40 dark:backdrop-blur-md ${
        isTitlesOnly ? 'p-3 hover:bg-background-light dark:hover:bg-night-mid/40' : 'p-6'
      }`}
      key={post.id}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <Link to={`/b/${post.id}`} className="block flex-1">
            <h2
              className={`font-bold text-text-primary-light transition-colors hover:text-primary-600 dark:text-text-primary-dark dark:hover:text-primary-400 ${
                isTitlesOnly ? 'text-base' : 'text-xl md:text-2xl mb-2'
              } ${isArabic(post.title) ? 'text-right' : 'text-left'}`}
            >
              {post.title}
            </h2>
          </Link>

          {isTitlesOnly && (
            <time className="shrink-0 text-xs text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">
              {formatTimeShort(Number(post.timestamp))}
            </time>
          )}
        </div>

        {!isTitlesOnly && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <div className="flex items-center gap-2">
              <UserLink
                userId={post.userId!}
                username={post.author!}
                complete={false}
                className="hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              />
            </div>

            <div className="flex items-center gap-1">
              <LikeBlogButton post={post} />
            </div>

            <button
              className="flex items-center gap-1 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => nav(`/b/${post.id}#comments`)}
              title={t('blog.comments')}
            >
              <span>{numOfComments.data?.numOfComments || 0}</span>
              <LiaCommentSolid size={18} />
            </button>

            {post.space && post.spaceId !== DefaultSpaceId && (
              <Link
                to={`/space/${post.spaceId}`}
                className="flex items-center gap-1 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                title={t('blog.space')}
              >
                <RiGroup2Fill size={16} />
                <span className="font-medium">{post.space.name}</span>
              </Link>
            )}

            {post.seriesLinks && post.seriesLinks.length > 0 && post.seriesLinks[0].series && (
              <Link
                to={`/series/${post.seriesLinks[0].series.id}`}
                className="flex items-center gap-1 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                title={t('blog.series')}
              >
                <RiStackLine size={16} />
                <span className="font-medium">{post.seriesLinks[0].series.name}</span>
              </Link>
            )}

            <time className="shrink-0 text-xs opacity-80" dateTime={String(post.timestamp)}>
              {formatTimeShort(Number(post.timestamp))}
            </time>
          </div>
        )}

        {!isTitlesOnly && post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag.id}
                to={`/tag/${tag.id}`}
                className="rounded-full bg-background-light px-2.5 py-0.5 text-xs font-medium text-text-secondary-light transition-colors hover:bg-primary-50 hover:text-primary-600 dark:bg-background-dark dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400 border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Excerpt */}
        {!isTitlesOnly && (
          <div className="mt-4 line-clamp-3 text-text-secondary-light dark:text-text-secondary-dark/90">
            <MyMarkdown markdown={post.content} />
          </div>
        )}
      </div>
    </div>
  );
};
