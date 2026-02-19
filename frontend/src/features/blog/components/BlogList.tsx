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
  return (
    <div
      className={`flex flex-col gap-4 transition-all ${
        finalViewMode === 'titles-only' ? 'gap-2' : ''
      }`}
    >
      {posts.map((post, key) => (
        <BlogIcon post={post as Blog} key={key} viewMode={finalViewMode as any} />
      ))}
      {/* {!isEnd && (
        <button disabled={isEnd} onClick={() => fetchNextPage}>
          Load More
        </button>
      )} */}
    </div>
  );
};
