import { MainLayout } from '@/app/layout';
import { tagBlogsApi } from '@/core/utils/api';
import { BlogList } from '../components/BlogList';

import { FeedsRes, PageSize } from '@nest/shared';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useScroll } from '@/core/hooks';

export const TagBlogsPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const { t } = useTranslation();
  const [isEnd, setIsEnd] = useState(false);

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useInfiniteQuery<FeedsRes>(
    ['tagBlogs', tag],
    ({ pageParam = 1 }) => tagBlogsApi(tag!, pageParam),
    {
      enabled: !!tag,
      getNextPageParam: lastPage => {
        if (lastPage.feeds.length < PageSize) return undefined;
        return lastPage.page + 1;
      },
      onSuccess: data => {
        const lastPage = data.pages[data.pages.length - 1];
        if (lastPage.feeds.length < PageSize) {
          setIsEnd(true);
        }
      },
    }
  );

  const queryResult = { data, fetchNextPage, hasNextPage, isLoading, isError, error } as any;
  useScroll(queryResult);

  const blogs = data?.pages.flatMap(page => page.feeds) || [];

  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full min-h-screen">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border-light bg-surface-light/80 px-4 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/80">
          <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            # {tag}
          </h1>
        </header>

        <div className="flex-1 p-4 lg:p-6">
          {isLoading && (
            <div className="flex justify-center p-8 text-text-secondary-light dark:text-text-secondary-dark">
              {t('state.loading')}
            </div>
          )}

          {isError && (
            <div className="flex justify-center p-8 text-red-500">
              {(error as any)?.message || t('state.error')}
            </div>
          )}

          {!isLoading && blogs.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary-light dark:text-[#71767b]">
              <p className="text-lg font-medium">No blogs found with this tag</p>
            </div>
          )}

          <BlogList posts={blogs} isEnd={isEnd} fetchNextPage={fetchNextPage} />
        </div>
      </div>
    </MainLayout>
  );
};
