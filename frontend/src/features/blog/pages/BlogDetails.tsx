import { MainLayout } from '@/app/layout';
import { useAuthContext } from '@/core/context';
import { formatTimeShort, isArabic } from '@/core/utils';
import { UserLink } from '@/features/user';

import { DefaultSpaceId } from '@nest/shared';

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

  if (blogQuery.isError)
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        {blogQuery.error.message}
      </div>
    );

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8">
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
                        to={`/space/${blog.space.id}`}
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
                          to={`/series/${blog.seriesLinks[0].series.id}`}
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

                {/* Table of Contents */}
                {hasHeadings && (
                  <div className="mb-8 rounded-xl border border-border-light bg-background-light/50 p-4 dark:border-border-dark dark:bg-background-dark/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                        Contents
                      </h3>
                      <button
                        onClick={toggleToc}
                        className="rounded-lg px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/10"
                      >
                        {showToc ? t('blogDetails.hideToc') : t('blogDetails.showToc')}
                      </button>
                    </div>

                    <div
                      className={`transition-all duration-300 ${
                        showToc
                          ? 'mt-4 max-h-[500px] opacity-100'
                          : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      <TableOfContents
                        headings={headings}
                        show={showToc}
                        toggle={toggleToc}
                        scrollTo={scrollToHeading}
                        t={t}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8">{MarkdownSection}</div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 border-t border-border-light pt-6 dark:border-border-dark">
                    {blog.tags.map(tag => (
                      <Link
                        key={tag.id}
                        to={`/tag/${tag.id}`}
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
