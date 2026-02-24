import { MainLayout } from '@/app/layout';
import { useAuthContext } from '@/core/context';
import { useSideBar } from '@/core/context/SideBarContext';
import { BlogList, SeriesDetail, SeriesList } from '@/features/blog';
import { useCreatePrivateConversation } from '@/features/chat';

import { Space } from '@nest/shared';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChatDots } from 'react-icons/bs';
import { FiArrowLeft, FiCalendar, FiSearch } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { FollowButton } from '../components/FollowButton';
import { FollowersModal, FollowingModal } from '../components';
import { useFollow } from '../hooks/useFollow';
import { useFollowing } from '../hooks/useFollowing';
import { useProfileData } from '../hooks/useProfileData';
import { ROUTES } from '@/core/utils';

export const UserProfile = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useSideBar();
  const { mutate: createConversation, isLoading: isCreatingConvo } = useCreatePrivateConversation();

  const { userCardQuery, userSpacesQuery, userBlogsQuery, isMyPage, isEnd } = useProfileData(id!);
  const { followersQuery } = useFollow(id!);
  const { followingQuery } = useFollowing(id!);

  const blogs = userBlogsQuery.data?.pages.flatMap(page => page.blogs) || [];
  const spaces = isMyPage
    ? userSpacesQuery.data?.spaces
    : userSpacesQuery.data?.spaces?.filter(space => space.status === 'public');
  const userCard = userCardQuery.data?.userCard;

  const [activeTab, setActiveTab] = useState<'posts' | 'spaces' | 'series'>('posts');
  const [search, setSearch] = useState<Space[] | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const followersCount = userCard?.followersNum || 0;
  const followingCount = userCard?.followingNum || 0;

  const handleSearch = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (value.length > 0) {
      const newSpaces = spaces?.filter(space =>
        space.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
      setSearch(newSpaces!);
    } else {
      setSearch(null);
    }
  };

  const handleStartChat = () => {
    if (!userCard) return;
    createConversation(
      { otherUserId: userCard.id },
      {
        onSuccess: conversation => {
          navigate(`/chat?conversationId=${conversation.id}`);
        },
      }
    );
  };

  if (userCardQuery.isError) {
    return (
      <MainLayout>
        <div className="w-full text-center mt-10 text-red-500">{t('userProfile.error')}</div>
      </MainLayout>
    );
  }

  if (userCardQuery.isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="mb-4 h-10 w-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full flex flex-col relative min-h-screen bg-transparent">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-surface-light/80 dark:bg-black/80 backdrop-blur-md border-b border-border-light dark:border-border-dark/60 flex items-center px-4 py-2 gap-6 h-[53px]">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <FiArrowLeft className="text-xl text-text-primary-light dark:text-text-primary-dark" />
          </button>
          <div className="flex flex-col">
            <h2 className="font-bold text-xl leading-tight text-text-primary-light dark:text-text-primary-dark">
              {userCard?.username}
            </h2>
            <span className="text-xs text-text-secondary-light dark:text-[#71767b]">
              {blogs.length} posts
            </span>
          </div>
        </div>

        {/* Cover Photo Area */}
        <div className="w-full h-[200px] bg-linear-to-r from-primary-600 to-indigo-800 relative">
          {userCard?.isOnline && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">Online</span>
            </div>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start">
            {/* Avatar overlapping cover */}
            <div className="relative -mt-16 sm:-mt-20 w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-surface-light dark:border-black bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-5xl font-bold text-primary-600 dark:text-primary-400">
              {userCard?.username.charAt(0).toUpperCase()}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-2">
              {currUser?.id === userCard?.id ? (
                <button className="px-4 py-1.5 font-bold rounded-full border border-border-light dark:border-[#536471] hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-white">
                  Edit profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleStartChat}
                    disabled={isCreatingConvo}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-border-light dark:border-[#536471] hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary-light dark:text-white"
                  >
                    <BsChatDots size={18} />
                  </button>
                  <FollowButton userId={userCard?.id!} />
                </>
              )}
            </div>
          </div>

          <div className="mt-2 mb-4">
            <h1 className="text-xl font-extrabold text-text-primary-light dark:text-text-primary-dark leading-5">
              {userCard?.username}
            </h1>
            <span className="text-[15px] text-text-secondary-light dark:text-[#71767b]">
              @{userCard?.id.substring(0, 8)}
            </span>

            <p className="mt-3 text-[15px] text-text-primary-light dark:text-white/90">
              Welcome to my profile. This is a generic bio since Primitive doesn't support custom
              bios yet.
            </p>

            <div className="flex items-center gap-4 mt-3 text-text-secondary-light dark:text-[#71767b] text-[15px]">
              <div className="flex items-center gap-1">
                <FiCalendar />
                <span>
                  Joined{' '}
                  {userCard &&
                    formatDistanceToNow(new Date(userCard.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="flex gap-5 mt-3 text-[15px]">
              <div
                className="flex gap-1 hover:underline cursor-pointer"
                onClick={() => setShowFollowing(true)}
              >
                <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
                  {followingCount}
                </span>
                <span className="text-text-secondary-light dark:text-[#71767b]">Following</span>
              </div>
              <div
                className="flex gap-1 hover:underline cursor-pointer"
                onClick={() => setShowFollowers(true)}
              >
                <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
                  {followersCount}
                </span>
                <span className="text-text-secondary-light dark:text-[#71767b]">Followers</span>
              </div>
            </div>
          </div>
        </div>

        <FollowersModal
          userId={id!}
          isOpen={showFollowers}
          onClose={() => setShowFollowers(false)}
        />
        <FollowingModal
          userId={id!}
          isOpen={showFollowing}
          onClose={() => setShowFollowing(false)}
        />

        {/* Tabs */}
        <div className="flex border-b border-border-light dark:border-border-dark/60 w-full overflow-x-auto no-scrollbar">
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            label="Posts"
          />
          <TabButton
            active={activeTab === 'spaces'}
            onClick={() => setActiveTab('spaces')}
            label="Spaces"
          />
          {isMyPage && (
            <TabButton
              active={activeTab === 'series'}
              onClick={() => setActiveTab('series')}
              label="Series"
            />
          )}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'posts' &&
            (blogs.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BlogList
                  posts={blogs}
                  isEnd={isEnd}
                  fetchNextPage={userBlogsQuery.fetchNextPage}
                  viewMode="full-blogs"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-text-secondary-light dark:text-[#71767b]">
                <p className="text-xl font-bold text-text-primary-light dark:text-white mb-2">
                  @{userCard?.username} hasn't posted
                </p>
                <p>When they do, their posts will show up here.</p>
              </div>
            ))}

          {activeTab === 'spaces' && (
            <div className="flex flex-col">
              <div className="p-4 border-b border-border-light dark:border-border-dark/60">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-[#71767b]" />
                  <input
                    type="search"
                    placeholder={t('userProfile.searchSpaces')}
                    onChange={handleSearch}
                    className="w-full bg-surface-light dark:bg-[#202327] border-none rounded-full py-2.5 pl-11 text-[15px] focus:ring-1 focus:ring-primary-500 placeholder:text-[#71767b] text-text-primary-light dark:text-white"
                  />
                </div>
              </div>

              {spaces &&
                (search || spaces).map(
                  space =>
                    space.id !== '1' && (
                      <Link
                        to={ROUTES.GET_SPACE(space.id)}
                        key={space.id}
                        className="p-4 border-b border-border-light dark:border-border-dark/60 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex justify-between items-center"
                      >
                        <h3 className="font-bold text-[15px] text-text-primary-light dark:text-white">
                          {space.name}
                        </h3>
                        <span className="text-[13px] text-text-secondary-light dark:text-[#71767b] capitalize border border-border-light dark:border-[#536471] px-2 py-0.5 rounded-full">
                          {space.status}
                        </span>
                      </Link>
                    )
                )}

              {(search || spaces)?.length === 0 && (
                <div className="p-8 text-center text-text-secondary-light dark:text-[#71767b]">
                  <p className="text-xl font-bold text-text-primary-light dark:text-white mb-2">
                    No spaces found
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'series' && isMyPage && (
            <div className="p-4">
              {selectedSeriesId ? (
                <SeriesDetail
                  seriesId={selectedSeriesId}
                  onBack={() => setSelectedSeriesId(null)}
                />
              ) : (
                <SeriesList onSelectSeries={setSelectedSeriesId} />
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

const TabButton = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-w-[100px] h-14 flex items-center justify-center relative font-medium text-[15px] ${
      active
        ? 'text-text-primary-light dark:text-white font-bold'
        : 'text-text-secondary-light dark:text-[#71767b]'
    }`}
  >
    {label}
    {active && <div className="absolute bottom-0 h-1 w-14 bg-primary-500 rounded-full"></div>}
  </button>
);
