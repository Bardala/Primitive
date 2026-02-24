import { MainLayout } from '@/app/layout';
import { seriesBlogsApi, Api } from '@/core/utils/api';
import { BlogList } from '../components/BlogList';

import { FeedsRes, PageSize, GetSeriesRes } from '@nest/shared';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useScroll } from '@/core/hooks';
import { RiStackLine } from 'react-icons/ri';

export const SeriesBlogsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [isEnd, setIsEnd] = useState(false);

  const seriesQuery = useQuery<GetSeriesRes>(
    ['series', id],
    () => Api.series.getSeries(id!),
    { enabled: !!id }
  );

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useInfiniteQuery<FeedsRes>(
    ['seriesBlogs', id],
    ({ pageParam = 1 }) => seriesBlogsApi(id!, pageParam),
    {
      enabled: !!id,
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
  const series = seriesQuery.data?.series;

  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full min-h-screen">
        <header className="sticky top-0 z-10 flex flex-col border-b border-border-light bg-surface-light/80 px-4 py-3 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/80">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
            <RiStackLine />
            <span className="text-xs font-bold uppercase tracking-widest">Series</span>
          </div>
          <h1 className="text-xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
            {series?.name || 'Loading Series...'}
          </h1>
          {series?.description && (
            <p className="mt-1 text-sm text-text-secondary-light dark:text-[#71767b]">
              {series.description}
            </p>
          )}
        </header>

        <div className="flex-1 p-4 lg:p-6">
          {(isLoading || seriesQuery.isLoading) && blogs.length === 0 && (
            <div className="flex justify-center p-8 text-text-secondary-light dark:text-text-secondary-dark">
              {t('state.loading')}
            </div>
          )}

          {isError && (
            <div className="flex justify-center p-8 text-red-500">
              {(error as any)?.message || t('state.error')}
            </div>
          )}

          {!isLoading && !seriesQuery.isLoading && blogs.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary-light dark:text-[#71767b]">
              <p className="text-lg font-medium">No blogs in this series yet</p>
            </div>
          )}

          <BlogList posts={blogs} isEnd={isEnd} fetchNextPage={fetchNextPage} />
        </div>
      </div>
    </MainLayout>
  );
};
