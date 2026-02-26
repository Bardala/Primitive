import { MainLayout } from '@/app/layout';
import { useAuthContext } from '@/core/context';
import { formatTimeShort, isArabic, ROUTES } from '@/core/utils';
import { UserLink } from '@/features/user';
import { useScrollSpy } from '@/core/hooks/useScrollSpy';

import { DefaultSpaceId } from '@nest/shared';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';

import GithubSlugger from 'github-slugger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaCommentSolid } from 'react-icons/lia';
import { RiGroup2Fill, RiStackLine } from 'react-icons/ri';
import { Link, useLocation, useParams } from 'react-router-dom';

import { AddToSeries } from '../components/AddToSeries';
import { BlogDetailsAction } from '../components/BlogDetailsAction';
import { Comments } from '../components/Comments';
import { LikeBlogButton } from '../components/LikeBlogButton';
import { MyMarkdown } from '../components/MyMarkdown';
import { TableOfContents } from '../components/TableOfContent';
import { useBlogPage } from '../hooks/useBlogPage';

// import '../styles/blogDetails.css';

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
  const activeHeadingId = useScrollSpy(
    headings.map(h => h.id),
    100
  );

  const [showMobileToc, setShowMobileToc] = useState(false);

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

  useEffect(() => {
    if (location.hash === '#comments' && commentsRef.current && !commentsQuery.isLoading) {
      commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentsQuery.isLoading, location]);

  if (blogQuery.isError)
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        {blogQuery.error.message}
      </div>
    );

  return (
    <MainLayout
      rightSidebar={
        hasHeadings ? (
          <div className="sticky top-4">
            <TableOfContents
              headings={headings}
              activeId={activeHeadingId}
              scrollTo={scrollToHeading}
              t={t}
            />
          </div>
        ) : null
      }
    >
      <div className="mx-auto max-w-5xl w-full py-8 sm:px-6">
        {blogQuery.isError && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {t('state.error')}
          </div> 
        )}
        {blogQuery.isLoading && (
          <div className="animate-pulse p-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
            {t('state.loading')}
          </div>
        )}

        {blog && (
          <div>
            <div className="rounded-2xl bg-surface-light p-6 shadow-sm ring-1 ring-border-light dark:bg-surface-dark dark:ring-border-dark sm:p-10">
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <h1
                  className={`mb-4 text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark sm:text-4xl ${
                    isArabic(blog.title) ? 'font-arabic text-right' : 'text-left'
                  }`}
                >
                  {blog.title}
                </h1>

                <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="font-medium">{t('blogDetails.writtenBy')}</span>
                  <UserLink
                    userId={blog.userId!}
                    username={blog.author || t('blogDetails.unknown')}
                  />
                  {blog.space && blog.space.id !== DefaultSpaceId && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <Link
                        to={ROUTES.GET_SPACE(blog.space.id)}
                        className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <RiGroup2Fill /> {blog.space.name}
                      </Link>
                    </>
                  )}
                  {blog.seriesLinks &&
                    blog.seriesLinks.length > 0 &&
                    blog.seriesLinks[0].series && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <Link
                          to={ROUTES.GET_SERIES(blog.seriesLinks[0].series.id)}
                          className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <RiStackLine /> {blog.seriesLinks[0].series.name}
                        </Link>
                      </>
                    )}

                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="italic">
                    {t('blogDetails.readingTime', { minutes: readingTime })}
                  </span>
                </div>

                {/* Custom Mobile TOC Trigger */}
                {hasHeadings && (
                  <div className="lg:hidden sticky top-[53px] z-30 mb-6 -mx-4 sm:mx-0">
                    <button
                      onClick={() => setShowMobileToc(!showMobileToc)}
                      className="flex w-full items-center justify-between border-y border-border-light bg-surface-light/95 px-6 py-3 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/95"
                    >
                      <div className="flex items-center gap-2">
                        <HiOutlineMenuAlt2 className="text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
                          {headings.find(h => h.id === activeHeadingId)?.text || 'Table of Contents'}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-text-secondary-light dark:text-[#71767b]">
                        {headings.findIndex(h => h.id === activeHeadingId) + 1} / {headings.length}
                      </div>
                    </button>

                    {showMobileToc && (
                      <div className="absolute left-0 right-0 top-full max-h-[60vh] overflow-y-auto border-b border-border-light bg-surface-light shadow-xl animate-in slide-in-from-top duration-200 dark:border-border-dark dark:bg-surface-dark">
                        <TableOfContents
                          headings={headings}
                          activeId={activeHeadingId}
                          scrollTo={id => {
                            scrollToHeading(id);
                            setShowMobileToc(false);
                          }}
                          t={t}
                          className="p-6"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8">{MarkdownSection}</div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 border-t border-border-light pt-6 dark:border-border-dark">
                    {blog.tags.map(tag => (
                      <Link
                        key={tag.id}
                        to={ROUTES.GET_TAG(tag.name)}
                        className="rounded-full bg-surface-light px-3 py-1 text-sm font-medium text-text-secondary-light ring-1 ring-border-light transition-all hover:bg-primary-50 hover:text-primary-700 hover:ring-primary-200 dark:bg-surface-dark dark:text-text-secondary-dark dark:ring-border-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400 dark:hover:ring-primary-800"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-border-light pt-6 dark:border-border-dark">
                  <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <p>{formatTimeShort(blog.timestamp!)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <LikeBlogButton post={blog} />

                    <button
                      className="flex items-center gap-1 text-text-secondary-light hover:text-primary-600 dark:text-text-secondary-dark dark:hover:text-primary-400"
                      onClick={goToComments}
                      title={t('blogDetails.comments')}
                    >
                      <span>{comments?.length}</span>
                      <LiaCommentSolid size={22} />
                    </button>

                    {currUser && currUser.id === blog.userId && <AddToSeries blogId={blog.id} />}
                  </div>
                </div>
              </article>

              {currUser && (
                <div className="mt-8 border-t border-border-light pt-6 dark:border-border-dark">
                  <BlogDetailsAction blog={blog} owner={blog.userId} currUser={currUser} />
                </div>
              )}
            </div>

            <div className="mt-8" ref={commentsRef}>
              {commentsQuery.isError && <div className="text-red-500">{t('state.error')}</div>}
              {commentsQuery.isLoading && (
                <div className="animate-pulse text-center text-text-secondary-light dark:text-text-secondary-dark">
                  {t('state.loading')}
                </div>
              )}

              {currUser && id && <Comments blogId={id} comments={comments!} />}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
