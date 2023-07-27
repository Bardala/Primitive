import { BlogCommentsReq, BlogCommentsRes, BlogReq, BlogRes, HOST } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import formatDistantToNow from 'date-fns/formatDistanceToNow';
import Markdown from 'markdown-to-jsx';
import { Link, useParams } from 'react-router-dom';

import { STATE } from '../StatesMsgs';
import { BlogDetailsAction } from '../components/BlogDetailsAction';
import { Comments } from '../components/Comments';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch/auth';
import '../styles/blogDetails.css';

export const BlogDetails = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();

  const blogQuery = useQuery(
    ['blog', id],
    () => fetchFn<BlogReq, BlogRes>(`${HOST}/blog/${id}`, 'GET', undefined, currUser?.jwt),
    { enabled: !!currUser?.jwt && !!id }
  );

  const commentsQuery = useQuery(
    ['comments', id],
    () =>
      fetchFn<BlogCommentsReq, BlogCommentsRes>(
        `${HOST}/blogComments/${id}`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    { enabled: !!currUser?.jwt && !!id }
  );

  const blog = blogQuery.data?.blog;
  const comments = commentsQuery.data?.comments;

  return (
    <div className="blog-details">
      {blogQuery.isError && <p className="error">{STATE.ERROR}</p>}
      {blogQuery.isLoading && <p className="loading">{STATE.LOADING}</p>}
      {blog && (
        <div>
          <div className="blog-content">
            <article>
              <h2>{blog.title}</h2>
              <div className="author-name">
                Written by{' '}
                <Link to={`/u/${blog.userId}`}>
                  <strong>{blog.author}</strong>
                </Link>
              </div>
              <Markdown
                className="blog-body"
                options={{
                  overrides: {
                    h1: {
                      props: {
                        style: { color: 'green' },
                      },
                    },
                    h2: {
                      props: {
                        style: { color: 'green' },
                      },
                    },
                    img: {
                      props: {
                        style: { maxWidth: '50%' },
                      },
                    },
                  },
                }}
              >
                {blog.content}
              </Markdown>

              <div className="blog-meta">
                <p className="created-at">
                  {formatDistantToNow(new Date(blog?.timestamp as number), {
                    addSuffix: true,
                  })}
                </p>

                <p className="comments-counts"> {comments?.length} comments</p>
              </div>
            </article>

            {currUser && <BlogDetailsAction blog={blog} owner={blog.userId} currUser={currUser} />}
          </div>

          {commentsQuery.isError && <p className="error">{STATE.ERROR}</p>}
          {commentsQuery.isLoading && <p className="loading">{STATE.LOADING}</p>}
          {currUser && id && <Comments blogId={id} currUser={currUser} comments={comments!} />}
        </div>
      )}
    </div>
  );
};
