import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaCommentSolid } from 'react-icons/lia';
import { useLocation, useParams } from 'react-router-dom';
import { UserLink } from 'src/components/UserLink';

import { BlogDetailsAction } from '../components/BlogDetailsAction';
import { Comments } from '../components/Comments';
import { LikeBlogButton } from '../components/LikeBlogButton';
import { MyMarkdown } from '../components/MyMarkdown';
import { useAuthContext } from '../context/AuthContext';
import { useBlogPage } from '../hooks/useBlogPage';
import '../styles/blogDetails.css';
import { formatTimeShort, isArabic } from '../utils/assists';

export const BlogDetails = () => {
  const { id } = useParams();
  const commentsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { currUser } = useAuthContext();
  const { t } = useTranslation();

  const { blogQuery, commentsQuery } = useBlogPage(id!);

  const blog = blogQuery.data?.blog;
  const comments = commentsQuery.data?.comments;

  const goToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (location.hash === '#comments' && commentsRef.current && !commentsQuery.isLoading) {
      commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentsQuery.isLoading, location]);

  if (blogQuery.isError) return <p className="error">{blogQuery.error.message}</p>;

  return (
    <div className="blog-details">
      {blogQuery.isError && <p className="error">{t('state.error')}</p>}
      {blogQuery.isLoading && <p className="loading">{t('state.loading')}</p>}

      {blog && (
        <div>
          <div className="blog-content">
            <article>
              <h2 className={isArabic(blog.title) ? 'blog-title arabic' : 'blog-title english'}>
                {blog.title}
              </h2>
              <div className="author-name">
                {t('blogDetails.writtenBy')}{' '}
                <UserLink
                  userId={blog.userId!}
                  username={blog.author || t('blogDetails.unknown')}
                />
              </div>
              <div className="blog-content">
                <MyMarkdown markdown={blog.content} />
              </div>

              <div className="blog-meta">
                <p className="created-at">{formatTimeShort(new Date(blog.timestamp!))}</p>

                <LikeBlogButton post={blog} />

                <p className="comms-count" onClick={goToComments} title={t('blogDetails.comments')}>
                  {comments?.length} <LiaCommentSolid size={20} />
                </p>
              </div>
            </article>

            {currUser && <BlogDetailsAction blog={blog} owner={blog.userId} currUser={currUser} />}
          </div>

          {commentsQuery.isError && <p className="error">{t('state.error')}</p>}
          {commentsQuery.isLoading && <p className="loading">{t('state.loading')}</p>}
          <div ref={commentsRef} />
          {currUser && id && <Comments blogId={id} comments={comments!} />}
        </div>
      )}
    </div>
  );
};
