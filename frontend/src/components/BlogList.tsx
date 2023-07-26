import { Blog } from '@nest/shared';
import { formatDistanceToNow } from 'date-fns';
import Markdown from 'markdown-to-jsx';
import { Link } from 'react-router-dom';

import '../styles/blogList.css';
import LikeBlogButton from './LikeButton';

export const BlogList: React.FC<{ blogs: Blog[] }> = ({ blogs }) => {
  console.log('blogs', blogs);

  return (
    <div className="blog-list">
      {blogs.map(blog => (
        <div className="blog-preview" key={blog.id}>
          <div className="blog-content">
            <Link to={`/blogs/${blog.id}`} className="blog-link">
              <div className="blog-header">
                <h2>{blog.title}</h2>
              </div>
            </Link>

            <div className="blog-meta">
              <p className="author">
                <strong>{blog.author}</strong>
              </p>
              {/* <p className="comments-count">{blog.comments.length} comments</p> */}

              <LikeBlogButton blog={blog} />
              <time className="created-at" dateTime={String(blog.timestamp)}>
                {formatDistanceToNow(new Date(blog.timestamp as number), { addSuffix: true })}
              </time>
            </div>
            <div className="blog-excerpt">
              <Markdown>
                {blog.content.length > 100 ? blog.content.slice(0, 100) + '...' : blog.content}
              </Markdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
