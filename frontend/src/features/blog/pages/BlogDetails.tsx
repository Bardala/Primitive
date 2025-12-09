import { useAuthContext } from '@/core/context';
import { formatTimeShort, isArabic } from '@/core/utils';
import { UserLink } from '@/features/user';

import GithubSlugger from 'github-slugger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaCommentSolid } from 'react-icons/lia';
import { useLocation, useParams } from 'react-router-dom';

import { BlogDetailsAction } from '../components/BlogDetailsAction';
import { Comments } from '../components/Comments';
import { LikeBlogButton } from '../components/LikeBlogButton';
import { MyMarkdown } from '../components/MyMarkdown';
import { TableOfContents } from '../components/TableOfContent';
import { useBlogPage } from '../hooks/useBlogPage';

import '../styles/blogDetails.css';

const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;

  // Remove markdown syntax and count words
  const plainText = text.replace(/[#*[\]()~`>\\\-_]/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).length;

  // Calculate reading time in minutes, at least 1 minute
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
};

const extractHeadings = (markdown: string) => {
  const lines = markdown.split('\n');
  const results: Array<{ id: string; text: string; level: number }> = [];
  const slugger = new GithubSlugger();

  for (const line of lines) {
    if (!line.startsWith('#')) continue;

    let level = 0;
    while (line[level] === '#') level++;

    if (line[level] !== ' ') continue;

    const text = line.slice(level + 1).trim();
    if (!text) continue;

    const id = slugger.slug(text); // EXACT MATCH with rehype-slug

    results.push({ id, text, level });
  }

  return results;
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

  const MarkdownSection = useMemo(() => {
    if (!blog) return null;
    return <MyMarkdown markdown={blog.content} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog?.content]);

  const readingTime = useMemo(() => {
    if (!blog) return 0;
    return calculateReadingTime(blog.content);
  }, [blog]);

  const headings = useMemo(() => {
    if (!blog) return [];
    return extractHeadings(blog.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog?.content]);
  const hasHeadings = headings.length > 0;

  const [showToc, setShowToc] = useState(false);

  const goToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Add temporary highlight
      element.classList.add('heading-highlight');
      setTimeout(() => element.classList.remove('heading-highlight'), 2000);
    }
  }, []);

  const toggleToc = useCallback(() => {
    setShowToc(prev => !prev);
  }, []);

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

              {/* Table of Contents */}
              {hasHeadings && (
                <>
                  <div className="toc-toggle-container">
                    <button onClick={toggleToc} className="toc-toggle-btn">
                      {showToc ? t('blogDetails.hideToc') : t('blogDetails.showToc')}
                    </button>
                  </div>

                  <TableOfContents
                    headings={headings}
                    show={showToc}
                    toggle={toggleToc}
                    scrollTo={scrollToHeading}
                    t={t}
                  />
                </>
              )}

              <div className="blog-content">{MarkdownSection}</div>

              <div className="blog-meta">
                <p className="created-at">{formatTimeShort(Number(blog.timestamp))}</p>

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
