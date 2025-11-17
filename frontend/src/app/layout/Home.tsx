import { useLocalStorage } from '@/core/hooks';
import { BlogList } from '@/features/blog';
import { useFeeds, useSmartFeeds } from '@/features/spaces';

import { useTranslation } from 'react-i18next';

import { ActionBar } from './SideBar';

import '../styles/home.css';

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

  const {
    smartFeeds,
    fetchNextPage: fetchSmartNextPage,
    isEnd: isSmartEnd,
    isLoading: isSmartLoading,
    spaceQuery: smartSpaceQuery,
  } = useSmartFeeds();

  const {
    feeds: chronologicalFeeds,
    fetchNextPage: fetchChronoNextPage,
    isEnd: isChronoEnd,
    isLoading: isChronoLoading,
    spaceQuery: chronoSpaceQuery,
  } = useFeeds();

  // Use the appropriate feed based on selection
  const currentFeeds = feedType === 'smart' ? smartFeeds : chronologicalFeeds;
  const currentFetchNextPage = feedType === 'smart' ? fetchSmartNextPage : fetchChronoNextPage;
  const currentIsEnd = feedType === 'smart' ? isSmartEnd : isChronoEnd;
  const currentIsLoading = feedType === 'smart' ? isSmartLoading : isChronoLoading;
  const currentSpaceQuery = feedType === 'smart' ? smartSpaceQuery : chronoSpaceQuery;

  if (currentSpaceQuery.isError) return <p className="error">{currentSpaceQuery.error.message}</p>;
  if (currentSpaceQuery.isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      <main>
        <div className="feed-controls">
          <div className="control-tabs compact">
            <div className="feed-type-tabs">
              <button
                className={`control-tab ${feedType === 'smart' ? 'active' : ''}`}
                onClick={() => handleFeedTypeChange('smart')}
              >
                {t('home.smartFeed')}
              </button>

              <button
                className={`control-tab ${feedType === 'chronological' ? 'active' : ''}`}
                onClick={() => handleFeedTypeChange('chronological')}
              >
                {t('home.chronologicalFeed')}
              </button>
            </div>

            <div className="divider"></div>

            <div className="view-mode-tabs">
              <button
                className={`control-tab ${viewMode === 'full-blogs' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('full-blogs')}
                title={t('home.fullBlogsView')}
              >
                {t('home.fullView')}
              </button>

              <button
                className={`control-tab ${viewMode === 'titles-only' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('titles-only')}
                title={t('home.titlesOnlyView')}
              >
                {t('home.titlesOnly')}
              </button>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {!!currentFeeds?.length && (
          <BlogList
            posts={currentFeeds}
            isEnd={currentIsEnd}
            fetchNextPage={currentFetchNextPage}
            viewMode={viewMode}
          />
        )}

        {currentFeeds?.length === 0 && !currentIsLoading && (
          <div className="not-found">
            <p>{t('home.noFeedsMessage')}</p>
          </div>
        )}

        {/* Loading State */}
        {currentIsLoading && (
          <div className="feed-loading">
            <p>{t('home.loadingFeeds')}</p>
          </div>
        )}
      </main>
      <ActionBar />
    </div>
  );
};
