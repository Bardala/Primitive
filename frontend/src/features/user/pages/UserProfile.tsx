import { MainLayout } from '@/app/layout';
import { useAuthContext } from '@/core/context';
import { BlogList, CreateSeriesModal, SeriesDetail, SeriesList } from '@/features/blog';

import { Space } from '@nest/shared';

import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiSearch } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import { UserInfoCard } from '../components/UserInfoCard';
import { useProfileData } from '../hooks/useProfileData';

export const UserProfile = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();
  const { t } = useTranslation();

  const { userCardQuery, userSpacesQuery, userBlogsQuery, isMyPage, isEnd } = useProfileData(id!);

  const blogs = userBlogsQuery.data?.pages.flatMap(page => page.blogs) || [];
  const spaces = isMyPage
    ? userSpacesQuery.data?.spaces
    : userSpacesQuery.data?.spaces.filter(space => space.status === 'public');
  const userCard = userCardQuery.data?.userCard;
  const [search, setSearch] = useState<Space[]>(spaces!);
  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  const handleSearch = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (value.length > 0) {
      const newSpaces = spaces?.filter(space =>
        space.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
      setSearch(newSpaces!);
    } else {
      setSearch(spaces!);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl">
        {userCardQuery.isError && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {t('userProfile.error')}
          </div>
        )}

        {userCardQuery.isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondary-light dark:text-text-secondary-dark">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
            {t('userProfile.loadingProfile')}
          </div>
        )}

        {userCard && currUser && (
          <div className="flex flex-col gap-6 tracking-tight">
            <header className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-10 shadow-md">
              <h1 className="text-3xl font-bold text-white leading-tight">
                {t('userProfile.profileTitle', { username: userCard.username })}
              </h1>
              {userCard.isOnline && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  <span className="text-sm font-medium text-green-100 italic">Online now</span>
                </div>
              )}
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-4">
                <UserInfoCard userCard={userCard} blogsLength={blogs?.length || 0} />

                <div className="rounded-2xl border border-border-light bg-surface-light p-6 shadow-md dark:border-border-dark dark:bg-surface-dark">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                      {t('userProfile.spaces')}
                    </h2>
                    <div className="relative flex-1">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark" />
                      <input
                        type="search"
                        placeholder={t('userProfile.searchSpaces')}
                        onChange={handleSearch}
                        className="input-base w-full py-2 pl-9 text-xs"
                      />
                    </div>
                  </div>

                  {userSpacesQuery.isError && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {t('userProfile.errorSpaces')}
                    </div>
                  )}

                  {userSpacesQuery.isLoading && (
                    <div className="py-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                      {t('userProfile.loadingSpaces')}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {spaces &&
                      (search || spaces).map(
                        space =>
                          space.id !== '1' && (
                            <div
                              className="group rounded-xl border border-border-light bg-background-light p-3 transition-all hover:bg-gray-50 hover:shadow-sm dark:border-border-dark dark:bg-background-dark dark:hover:bg-primary-900/10"
                              key={space.id}
                            >
                              <Link to={`/space/${space.id}`} className="block">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-text-primary-light group-hover:text-primary-600 dark:text-text-primary-dark dark:group-hover:text-primary-400">
                                    {space.name}
                                  </h3>
                                  <span className="rounded-full bg-surface-light px-2 py-0.5 text-[10px] font-bold text-text-secondary-light shadow-sm dark:bg-surface-dark dark:text-text-secondary-dark uppercase tracking-widest border border-border-light/50 dark:border-border-dark/50">
                                    {space.status}
                                  </span>
                                </div>
                              </Link>
                            </div>
                          )
                      )}

                    {(search || spaces)?.length === 0 && !userSpacesQuery.isLoading && (
                      <div className="py-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark opacity-60">
                        <p>{t('userProfile.noSpaces')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isMyPage && (
                  <div className="rounded-2xl border border-border-light bg-surface-light p-6 shadow-md dark:border-border-dark dark:bg-surface-dark">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                        Blog Series
                      </h2>
                      <button
                        onClick={() => setShowCreateSeriesModal(true)}
                        className="text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                      >
                        + Create
                      </button>
                    </div>

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

              <div className="flex flex-col gap-6 lg:col-span-8">
                <div className="flex items-center justify-between rounded-2xl border border-border-light bg-surface-light p-6 shadow-md dark:border-border-dark dark:bg-surface-dark">
                  <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {t('userProfile.blogs')}
                  </h2>
                  <span className="rounded-full bg-primary-100 px-4 py-1.5 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 shadow-sm uppercase tracking-wide">
                    {blogs.length < 10 ? blogs.length : '10+'} {t('userProfile.posts')}
                  </span>
                </div>

                {userBlogsQuery.isError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                    {t('userProfile.errorBlogs')}
                  </div>
                )}

                {userBlogsQuery.isLoading && (
                  <div className="py-20 text-center text-text-secondary-light dark:text-text-secondary-dark font-medium animate-pulse">
                    {t('userProfile.loadingBlogs')}
                  </div>
                )}

                {blogs.length > 0 ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BlogList
                      posts={blogs}
                      isEnd={isEnd}
                      fetchNextPage={userBlogsQuery.fetchNextPage}
                      viewMode="full-blogs"
                    />
                  </div>
                ) : (
                  !userBlogsQuery.isLoading && (
                    <div className="rounded-3xl border-2 border-dashed border-border-light p-16 text-center text-text-secondary-light dark:border-border-dark dark:text-text-secondary-dark bg-surface-light/30 dark:bg-surface-dark/30">
                      <FiFileText className="mx-auto mb-6 text-5xl opacity-30" />
                      <p className="mb-6 text-lg font-medium">{t('userProfile.noBlogs')}</p>
                      <Link
                        to="/create-blog"
                        className="inline-flex items-center rounded-xl bg-primary-600 px-6 py-3 font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg active:scale-95 shadow-md"
                      >
                        {t('userProfile.createBlog')}
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        <CreateSeriesModal
          isOpen={showCreateSeriesModal}
          onClose={() => setShowCreateSeriesModal(false)}
        />
      </div>
    </MainLayout>
  );
};
