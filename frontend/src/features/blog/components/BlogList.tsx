import { BlogListViewMode } from '@/app/layout';

import { Blog, Short } from '@nest/shared';

import { BlogIcon } from './BlogIcon';

import '../styles/blogList.css';

interface Props {
  posts: (Blog | Short)[];
  isEnd?: boolean;
  fetchNextPage?: () => void;
  viewMode?: BlogListViewMode;
}

export const BlogList = ({ posts, isEnd, fetchNextPage, viewMode = 'full-blogs' }: Props) => {
  return (
    <div className={`blog-list ${viewMode === 'titles-only' ? 'titles-only' : ''}`}>
      {posts.map(post => (
        <BlogIcon post={post} key={post.id} viewMode={viewMode} />
      ))}
      {/* {!isEnd && (
        <button disabled={isEnd} onClick={() => fetchNextPage}>
          Load More
        </button>
      )} */}
    </div>
  );
};
