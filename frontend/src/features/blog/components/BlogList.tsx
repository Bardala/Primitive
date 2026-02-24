import { BlogListViewMode } from '@/app/layout';

import { Blog, Short } from '@nest/shared';

import { BlogIcon } from './BlogIcon';

interface Props {
  posts: (Blog | Short)[];
  isEnd?: boolean;
  fetchNextPage?: () => void;
  viewMode?: BlogListViewMode;
  titlesOnly?: boolean;
}

export const BlogList = ({
  posts,
  isEnd,
  fetchNextPage,
  viewMode = 'full-blogs',
  titlesOnly = false,
}: Props) => {
  const finalViewMode = titlesOnly ? 'titles-only' : viewMode;
  const uniquePosts = Array.from(new Map(posts.map(post => [post.id, post])).values());

  return (
    <div
      className={`flex flex-col transition-all ${finalViewMode === 'titles-only' ? 'gap-2' : ''}`}
    >
      {uniquePosts.map(post => (
        <BlogIcon post={post as Blog} key={post.id} viewMode={finalViewMode as any} />
      ))}
      {/* {!isEnd && (
        <button disabled={isEnd} onClick={() => fetchNextPage}>
          Load More
        </button>
      )} */}
    </div>
  );
};
