import { LiaCommentSolid } from 'react-icons/lia';
import { Link, useParams } from 'react-router-dom';

import { BlogDetailsAction } from '../components/BlogDetailsAction';
import { Comments } from '../components/Comments';
import { LikeBlogButton } from '../components/LikeBlogButton';
import { MyMarkdown } from '../components/MyMarkdown';
import { useAuthContext } from '../context/AuthContext';
import { useBlogPage } from '../hooks/useBlogPage';
import '../styles/blogDetails.css';
import { STATE } from '../utils/StatesMsgs';
import { formatTimeShort, isArabic } from '../utils/assists';

export const BlogDetails = () => {
  const { id } = useParams();
  const { currUser } = useAuthContext();

  const { blogQuery, commentsQuery } = useBlogPage(id!);

  const blog = blogQuery.data?.blog;
  const comments = commentsQuery.data?.comments;

  if (blogQuery.isError) return <p className="error">{blogQuery.error.message}</p>;

  return (
    <div className="blog-details">
      {blogQuery.isError && <p className="error">{STATE.ERROR}</p>}
      {blogQuery.isLoading && <p className="loading">{STATE.LOADING}</p>}
      {blog && (
        <div>
          <div className="blog-content">
            <article>
              <h2 className="blog-title">{blog.title}</h2>
              <div className="author-name">
                Written by{' '}
                <Link to={`/u/${blog.userId}`}>
                  <strong>{blog.author}</strong>
                </Link>
              </div>
              <div id="blog-content" className={isArabic(blog.content.slice(10)) ? 'arabic' : ''}>
                <MyMarkdown markdown={blog.content} />
              </div>

              <div className="blog-meta">
                <p className="created-at">{formatTimeShort(new Date(blog.timestamp!))}</p>

                <LikeBlogButton post={blog} />

                <p className="comments-counts">
                  {' '}
                  {comments?.length} <LiaCommentSolid size={20} />
                </p>
              </div>
            </article>

            {currUser && <BlogDetailsAction blog={blog} owner={blog.userId} currUser={currUser} />}
          </div>

          {commentsQuery.isError && <p className="error">{STATE.ERROR}</p>}
          {commentsQuery.isLoading && <p className="loading">{STATE.LOADING}</p>}
          {currUser && id && <Comments blogId={id} comments={comments!} />}
        </div>
      )}
    </div>
  );
};
