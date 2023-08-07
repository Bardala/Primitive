import { Blog, Short } from '@nest/shared';

import '../styles/blogList.css';
import { BlogIcon } from './BlogIcon';

export const BlogList: React.FC<{ posts: (Blog | Short)[] }> = ({ posts }) => {
  return (
    <div className="blog-list">
      {posts.map(post => (
        <BlogIcon post={post} key={post.id} />
      ))}
      {/* {post.content.length > ShortLength ? (
            ) : (
              <ShortIcon post={post} key={post.id} />
            )} */}
    </div>
  );
};
