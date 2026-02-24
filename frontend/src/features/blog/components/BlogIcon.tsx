import { formatTimeShort, isArabic, ROUTES } from '@/core/utils';
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
      className={`group relative flex flex-col overflow-hidden px-4 md:px-6 py-5 border-b border-border-light dark:border-border-dark/60 bg-transparent transition-all hover:bg-black/5 dark:hover:bg-white/5 ${
        isTitlesOnly ? 'py-3' : ''
      }`}
      key={post.id}
    >
      <div className="flex flex-col gap-2">
        {/* TOP: Space Name */}
        {!isTitlesOnly && post.space && post.spaceId !== DefaultSpaceId && (
          <div className="mb-2">
            <Link
              to={ROUTES.GET_SPACE(post.spaceId)}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 hover:underline"
            >
              <RiGroup2Fill size={12} />
              {post.space.name}
            </Link>
          </div>
        )}

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <Link to={ROUTES.GET_BLOG_DETAILS(post.id)} className="block">
              <h2
                className={`font-bold text-text-primary-light transition-colors hover:text-primary-600 dark:text-text-primary-dark dark:hover:text-primary-400 ${
                  isTitlesOnly ? 'text-base' : 'text-xl md:text-2xl mb-1'
                } ${isArabic(post.title) ? 'text-right' : 'text-left'}`}
              >
                {post.title}
              </h2>
            </Link>

            {/* Series name below title */}
            {!isTitlesOnly &&
              post.seriesLinks &&
              post.seriesLinks.length > 0 &&
              post.seriesLinks[0].series && (
                <div className="mb-2">
                  <Link
                    to={ROUTES.GET_SERIES(post.seriesLinks[0].series.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <RiStackLine size={14} />
                    {post.seriesLinks[0].series.name}
                  </Link>
                </div>
              )}
          </div>

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

            <time className="shrink-0 text-xs opacity-80" dateTime={String(post.timestamp)}>
              {formatTimeShort(Number(post.timestamp))}
            </time>
          </div>
        )}

        {/* Excerpt */}
        {!isTitlesOnly && (
          <div className="mt-3 line-clamp-3 text-text-secondary-light dark:text-text-secondary-dark/90">
            <MyMarkdown markdown={post.content} />
          </div>
        )}

        {/* BOTTOM: Tags */}
        {!isTitlesOnly && post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border-light pt-3 dark:border-white/5">
            {post.tags.map(tag => (
              <Link
                key={tag.id}
                to={ROUTES.GET_TAG(tag.id)}
                className="text-[10px] uppercase font-bold text-text-secondary-light dark:text-text-secondary-dark/60 hover:text-primary-600 dark:hover:text-primary-400 tracking-tight"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
