import { isArabic } from '@/core/utils';
import { LikeBlogButton } from '@/features/blog';

import { Short } from '@nest/shared';

import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export const ShortIcon: React.FC<{ post: Short }> = ({ post }) => {
  return (
    <div
      className="card-base group relative flex flex-col gap-4 overflow-hidden border border-border-light bg-surface-light p-6 transition-all hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
      key={post.id}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-text-primary-light line-clamp-2 group-hover:text-primary-600 dark:text-text-primary-dark dark:group-hover:text-primary-400">
          {post.title}
        </h2>
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark">
        <div className="flex items-center gap-2">
          <Link
            to={`/u/${post.userId}`}
            className="font-semibold text-text-primary-light hover:underline dark:text-text-primary-dark"
          >
            {post.author}
          </Link>
          <span>•</span>
          <time dateTime={String(post.timestamp)}>
            {formatDistanceToNow(new Date(post.timestamp as number))} ago
          </time>
        </div>

        {post.spaceId !== '1' && (
          <Link
            to={`/space/${post?.spaceId}`}
            className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/40"
          >
            Space
          </Link>
        )}
      </div>

      <div
        className={`text-sm leading-relaxed text-text-secondary-light line-clamp-3 dark:text-text-secondary-dark ${
          isArabic(post.content) ? 'text-right' : 'text-left'
        }`}
      >
        {post.content}
      </div>

      <div className="mt-auto flex items-center justify-end border-t border-border-light pt-4 dark:border-border-dark">
        <LikeBlogButton post={post} />
      </div>
    </div>
  );
};
