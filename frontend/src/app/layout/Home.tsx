import { useAuthContext } from '@/core/context';
import { useSideBar } from '@/core/context/SideBarContext';
import { useLocalStorage } from '@/core/hooks';
import { BlogList } from '@/features/blog';
import { useGetDefaultSpace, usePublicFeeds, useSmartPublicFeeds } from '@/features/spaces';

import { useTranslation } from 'react-i18next';
import { CiLocationOn } from 'react-icons/ci';
import { FiGrid, FiList } from 'react-icons/fi';
import { IoImageOutline } from 'react-icons/io5';
import { MdOutlineEmojiEmotions, MdOutlineGifBox } from 'react-icons/md';
import { RiCalendarCheckLine, RiListRadio } from 'react-icons/ri';
import { Link } from 'react-router-dom';

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
  const { currUser } = useAuthContext();
  const { dispatch } = useSideBar();

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
    <MainLayout space={currentSpaceQuery.data?.space}>
      <div className="flex flex-col w-full h-full relative">
        {/* Sticky Header with Tabs */}
        <div className="sticky top-0 z-10 sm:z-20 w-full bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark/60 flex items-center justify-between">
          <div className="flex flex-1 items-center h-[53px]">
            {/* For you Tab */}
            <button
              className="flex-1 flex justify-center h-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
              onClick={() => handleFeedTypeChange('smart')}
            >
              <div className="relative flex items-center justify-center font-bold h-full px-2">
                <span
                  className={`${
                    feedType === 'smart'
                      ? 'text-text-primary-light dark:text-text-primary-dark font-bold'
                      : 'text-text-secondary-light dark:text-text-secondary-dark font-medium'
                  }`}
                >
                  {t('home.smartFeed') || 'For you'}
                </span>
                {feedType === 'smart' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full"></div>
                )}
              </div>
            </button>

            {/* Following Tab */}
            <button
              className="flex-1 flex justify-center h-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
              onClick={() => handleFeedTypeChange('chronological')}
            >
              <div className="relative flex items-center justify-center font-bold h-full px-2">
                <span
                  className={`${
                    feedType === 'chronological'
                      ? 'text-text-primary-light dark:text-text-primary-dark font-bold'
                      : 'text-text-secondary-light dark:text-text-secondary-dark font-medium'
                  }`}
                >
                  {t('home.chronologicalFeed') || 'Following'}
                </span>
                {feedType === 'chronological' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-full"></div>
                )}
              </div>
            </button>
          </div>

          {/* View Mode Settings Icon (kept for primitive feature) */}
          <div className="flex items-center px-4 shrink-0">
            <button
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-text-secondary-light dark:text-text-secondary-dark"
              onClick={() =>
                handleViewModeChange(viewMode === 'full-blogs' ? 'titles-only' : 'full-blogs')
              }
              title={t('home.toggleViewMode')}
            >
              {viewMode === 'full-blogs' ? <FiGrid size={18} /> : <FiList size={18} />}
            </button>
          </div>
        </div>

        {/* Dummy Post Composer */}
        {currUser && (
          <div
            className="flex px-4 pt-3 pb-2 border-b border-border-light dark:border-border-dark/60 cursor-pointer"
            onClick={() => dispatch({ type: 'showCreateBlog' })}
          >
            {/* Avatar */}
            <div className="mr-3 shrink-0">
              <Link to={`/u/${currUser.id}`} onClick={e => e.stopPropagation()}>
                <div className="h-10 w-10 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold hover:brightness-90 transition-all">
                  {currUser.username.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>

            {/* Composer Body */}
            <div className="flex-1 flex flex-col justify-center min-w-0 pb-1">
              <div className="py-2 text-xl text-text-secondary-light dark:text-gray-500">
                What is happening?!
              </div>

              <div className="flex items-center justify-between mt-3 mb-1">
                {/* Icons */}
                <div className="flex items-center gap-1 text-primary-500">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                    <IoImageOutline size={20} />
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                    <MdOutlineGifBox size={22} />
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors hidden sm:flex">
                    <RiListRadio size={20} />
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                    <MdOutlineEmojiEmotions size={22} />
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors hidden sm:flex">
                    <RiCalendarCheckLine size={20} />
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors opacity-50 cursor-not-allowed">
                    <CiLocationOn size={22} />
                  </div>
                </div>

                {/* Post Button */}
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-1.5 rounded-full shadow-sm disabled:opacity-50 transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog List Feed */}
        <div className="flex-1 w-full min-h-0">
          {!!currentFeeds?.length && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mb-10 sm:mb-0">
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
      </div>
    </MainLayout>
  );
};
