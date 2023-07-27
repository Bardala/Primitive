import { Blog } from '@nest/shared';

import '../styles/blogList.css';
import { BlogIcon } from './BlogIcon';

export const BlogList: React.FC<{ blogs: Blog[] }> = ({ blogs }) => {
  return (
    <div className="blog-list">
      {blogs.map(blog => (
        <BlogIcon blog={blog} key={blog.id} />
      ))}
    </div>
  );
};
