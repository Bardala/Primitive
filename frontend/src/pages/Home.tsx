import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeeds, useSmartFeeds } from 'src/hooks/useSpace';

import { BlogList } from '../components/BlogList';
import { ActionBar } from '../components/SideBar';
import '../styles/home.css';

export type FeedType = 'chronological' | 'smart';

// todo: feat=> let the user indicate viewing titles only or full blogs.
export const Home = () => {
  const [feedType, setFeedType] = useState<FeedType>('smart');
  const { t } = useTranslation();

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
  if (currentSpaceQuery.isLoading) return <div>Loading...</div>;

  return (
    <div className="home">
      <main>
        <div className="feed-tabs">
          <button
            className={`feed-tab ${feedType === 'smart' ? 'active' : ''}`}
            onClick={() => setFeedType('smart')}
          >
            {t('home.smartFeed')}
          </button>

          <button
            className={`feed-tab ${feedType === 'chronological' ? 'active' : ''}`}
            onClick={() => setFeedType('chronological')}
          >
            {t('home.chronologicalFeed')}
          </button>
        </div>

        {/* Blog List */}
        {!!currentFeeds?.length && (
          <BlogList
            posts={currentFeeds}
            isEnd={currentIsEnd}
            fetchNextPage={currentFetchNextPage}
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
