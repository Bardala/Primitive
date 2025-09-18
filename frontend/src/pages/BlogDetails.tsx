import { useEffect, useRef, useState } from 'react';
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

const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;

  // Remove markdown syntax and count words
  const plainText = text.replace(/[#*[\]()~`>\\\-_]/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).length;

  // Calculate reading time in minutes, at least 1 minute
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
};

const extractHeadings = (markdown: string): Array<{ id: string; text: string; level: number }> => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Create ID by converting to lowercase, replacing spaces with hyphens, and removing special chars
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text, level });
  }

  return headings;
};

export const BlogDetails = () => {
  const { id } = useParams();
  const commentsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { currUser } = useAuthContext();
  const { t } = useTranslation();

  const { blogQuery, commentsQuery } = useBlogPage(id!);

  const blog = blogQuery.data?.blog;
  const comments = commentsQuery.data?.comments;

  const readingTime = blog ? calculateReadingTime(blog.content) : 0;

  const headings = blog ? extractHeadings(blog.content) : [];
  const hasHeadings = headings.length > 0;

  const [showToc, setShowToc] = useState(false);

  const goToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Add temporary highlight
      element.classList.add('heading-highlight');
      setTimeout(() => element.classList.remove('heading-highlight'), 2000);
    }
  };

  const toggleToc = () => {
    setShowToc(!showToc);
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

              <div className="reading-time">
                {t('blogDetails.readingTime', { minutes: readingTime })}
              </div>

              {/* Table of Contents Toggle Button */}
              {hasHeadings && (
                <div className="toc-toggle-container">
                  <button onClick={toggleToc} className="toc-toggle-btn">
                    {showToc ? t('blogDetails.hideToc') : t('blogDetails.showToc')}
                  </button>
                </div>
              )}

              {/* Table of Contents */}
              {hasHeadings && showToc && (
                <div className="table-of-contents">
                  <div className="toc-header">
                    <h3>{t('blogDetails.tableOfContents')}</h3>
                    <button
                      onClick={toggleToc}
                      className="toc-close-btn"
                      title={t('blogDetails.hideToc')}
                    >
                      ×
                    </button>
                  </div>
                  <ul>
                    {headings.map((heading, index) => (
                      <li
                        key={index}
                        className={`toc-level-${heading.level}`}
                        style={{ marginLeft: `${(heading.level - 1) * 16}px` }}
                      >
                        <button onClick={() => scrollToHeading(heading.id)} className="toc-link">
                          {heading.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
