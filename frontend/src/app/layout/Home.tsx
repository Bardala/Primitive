import { useLocalStorage } from '@/core/hooks';
import { BlogList } from '@/features/blog';
import { useGetDefaultSpace, usePublicFeeds, useSmartPublicFeeds } from '@/features/spaces';

import { useTranslation } from 'react-i18next';
import { FiClock, FiGrid, FiList, FiZap } from 'react-icons/fi';

import { MainLayout } from './MainLayout';

export type FeedType = 'chronological' | 'smart';
export type BlogListViewMode = 'titles-only' | 'full-blogs';

interface FeedPreferences {
  feedType: FeedType;
  viewMode: BlogListViewMode;
}

const defaultPreferences: FeedPreferences = {
  feedType: 'smart',
  viewMode: 'full-blogs',
};

export const Home = () => {
  const [preferences, setPreferences] = useLocalStorage<FeedPreferences>(
    'FEED_PREFERENCES',
    defaultPreferences
  );

  const { feedType, viewMode } = preferences;
  const { t } = useTranslation();

  const handleFeedTypeChange = (newFeedType: FeedType) => {
    setPreferences(prev => ({ ...prev, feedType: newFeedType }));
  };

  const handleViewModeChange = (newViewMode: BlogListViewMode) => {
    setPreferences(prev => ({ ...prev, viewMode: newViewMode }));
  };

  const spaceQuery = useGetDefaultSpace();

  const {
    feeds: smartFeeds,
    isLoading: isSmartLoading,
    fetchNextPage: fetchSmartNextPage,
    isEnd: isSmartEnd,
  } = useSmartPublicFeeds();

  const {
    feeds: chronologicalFeeds,
    isLoading: isChronoLoading,
    fetchNextPage: fetchChronoNextPage,
    isEnd: isChronoEnd,
  } = usePublicFeeds();

  // Use the appropriate feed based on selection
  const currentFeeds = feedType === 'smart' ? smartFeeds : chronologicalFeeds;
  const currentFetchNextPage = feedType === 'smart' ? fetchSmartNextPage : fetchChronoNextPage;
  const currentIsEnd = feedType === 'smart' ? isSmartEnd : isChronoEnd;
  const currentIsLoading = feedType === 'smart' ? isSmartLoading : isChronoLoading;
  const currentSpaceQuery = spaceQuery;

  if (currentSpaceQuery.isError)
    return <div className="p-8 text-center text-red-500">{currentSpaceQuery.error.message}</div>;
  if (currentSpaceQuery.isLoading)
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );

  return (
    <MainLayout>
      <div className="mx-auto flex w-full max-w-4xl flex-col transition-all">
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border-light/50 bg-surface-light/80 p-2 backdrop-blur-md dark:border-border-dark/50 dark:bg-surface-dark/80 sm:flex-row sm:items-center">
            {/* Feed Type Segmented Control */}
            <div className="flex flex-1 items-center rounded-xl bg-background-light p-1 dark:bg-background-dark/50 sm:flex-none">
              <button
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-none ${
                  feedType === 'smart'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md active:scale-95'
                    : 'text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-white'
                }`}
                onClick={() => handleFeedTypeChange('smart')}
              >
                <FiZap className={feedType === 'smart' ? 'fill-current' : ''} />
                <span>{t('home.smartFeed')}</span>
              </button>

              <button
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-none ${
                  feedType === 'chronological'
                    ? 'bg-surface-light text-primary-600 shadow-sm ring-1 ring-border-light dark:bg-surface-dark dark:text-white dark:ring-border-dark active:scale-95'
                    : 'text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-white'
                }`}
                onClick={() => handleFeedTypeChange('chronological')}
              >
                <FiClock />
                <span>{t('home.chronologicalFeed')}</span>
              </button>
            </div>

            {/* View Mode Segmented Control */}
            <div className="flex items-center justify-center gap-1 rounded-xl bg-background-light p-1 dark:bg-background-dark/50">
              <button
                className={`rounded-lg p-2 transition-all ${
                  viewMode === 'full-blogs'
                    ? 'bg-surface-light text-primary-600 shadow-sm dark:bg-surface-dark dark:text-primary-400 active:scale-90'
                    : 'text-text-secondary-light hover:bg-gray-200/50 dark:text-text-secondary-dark dark:hover:bg-white/5'
                }`}
                onClick={() => handleViewModeChange('full-blogs')}
                title={t('home.fullBlogsView')}
              >
                <FiList size={20} />
              </button>

              <button
                className={`rounded-lg p-2 transition-all ${
                  viewMode === 'titles-only'
                    ? 'bg-surface-light text-primary-600 shadow-sm dark:bg-surface-dark dark:text-primary-400 active:scale-90'
                    : 'text-text-secondary-light hover:bg-gray-200/50 dark:text-text-secondary-dark dark:hover:bg-white/5'
                }`}
                onClick={() => handleViewModeChange('titles-only')}
                title={t('home.titlesOnlyView')}
              >
                <FiGrid size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {!!currentFeeds?.length && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BlogList
              posts={currentFeeds}
              isEnd={currentIsEnd}
              fetchNextPage={currentFetchNextPage}
              viewMode={viewMode}
            />
          </div>
        )}

        {currentFeeds?.length === 0 && !currentIsLoading && (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark/60">
              {t('home.noFeedsMessage')}
            </p>
          </div>
        )}

        {/* Loading State */}
        {currentIsLoading && (
          <div className="mt-12 flex justify-center">
            <p className="animate-pulse text-lg font-medium text-primary-600 dark:text-primary-400">
              {t('home.loadingFeeds')}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
