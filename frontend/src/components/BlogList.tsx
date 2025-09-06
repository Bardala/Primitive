import { Blog, Short } from '@nest/shared';

import '../styles/blogList.css';
import { BlogIcon } from './BlogIcon';

interface Props {
  posts: (Blog | Short)[];
  isEnd?: boolean;
  fetchNextPage?: () => void;
}

export const BlogList = ({ posts, isEnd, fetchNextPage }: Props) => {
  return (
    <div className="blog-list">
      {posts.map(post => (
        <BlogIcon post={post} key={post.id} />
      ))}
      {/* {!isEnd && (
        <button disabled={isEnd} onClick={() => fetchNextPage}>
          Load More
        </button>
      )} */}
    </div>
  );
};
