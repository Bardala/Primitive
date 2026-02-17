import { useAuthContext } from '@/core/context';
import { BlogList, CreateSeriesModal, SeriesDetail, SeriesList } from '@/features/blog';

import { Space } from '@nest/shared';

import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiSearch } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import { UserInfoCard } from '../components/UserInfoCard';
import { useProfileData } from '../hooks/useProfileData';

import '../styles/user-profile.css';

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
    <div className="user-profile-container">
      {userCardQuery.isError && <div className="error-message">{t('userProfile.error')}</div>}

      {userCardQuery.isLoading && (
        <div className="loading-state">{t('userProfile.loadingProfile')}</div>
      )}

      {userCard && currUser && (
        <div className="user-profile">
          <header className="profile-header">
            <h1>{t('userProfile.profileTitle', { username: userCard.username })}</h1>
          </header>

          <div className="profile-content">
            <div className="user-info-section">
              <UserInfoCard userCard={userCard} blogsLength={blogs?.length || 0} />

              <div className="user-spaces-section">
                <div className="section-header">
                  <h2>{t('userProfile.spaces')}</h2>
                  <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                      type="search"
                      placeholder={t('userProfile.searchSpaces')}
                      onChange={handleSearch}
                      className="search-input"
                    />
                  </div>
                </div>

                {userSpacesQuery.isError && (
                  <div className="error-message">{t('userProfile.errorSpaces')}</div>
                )}

                {userSpacesQuery.isLoading && (
                  <div className="loading-state">{t('userProfile.loadingSpaces')}</div>
                )}

                <div className="spaces-grid">
                  {spaces &&
                    (search || spaces).map(
                      space =>
                        space.id !== '1' && (
                          <div className="space-card" key={space.id}>
                            <Link to={`/space/${space.id}`} className="space-link">
                              <div className="space-content">
                                <h3>{space.name}</h3>
                                <span className="space-status">{space.status}</span>
                              </div>
                            </Link>
                          </div>
                        )
                    )}

                  {(search || spaces)?.length === 0 && !userSpacesQuery.isLoading && (
                    <div className="empty-state">
                      <p>{t('userProfile.noSpaces')}</p>
                    </div>
                  )}
                </div>
              </div>

              {isMyPage && (
                <div className="user-spaces-section">
                  <div className="section-header">
                    <h2>Blog Series</h2>
                    <button onClick={() => setShowCreateSeriesModal(true)} className="create-link">
                      Create Series
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

            <div className="user-blogs-section">
              <div className="section-header">
                <h2>{t('userProfile.blogs')}</h2>
                <span className="blogs-count">
                  {blogs.length < 10 ? blogs.length : '10+'} {t('userProfile.posts')}
                </span>
              </div>

              {userBlogsQuery.isError && (
                <div className="error-message">{t('userProfile.errorBlogs')}</div>
              )}

              {userBlogsQuery.isLoading && (
                <div className="loading-state">{t('userProfile.loadingBlogs')}</div>
              )}

              {blogs.length > 0 ? (
                <BlogList
                  posts={blogs}
                  isEnd={isEnd}
                  fetchNextPage={userBlogsQuery.fetchNextPage}
                  viewMode="full-blogs"
                />
              ) : (
                !userBlogsQuery.isLoading && (
                  <div className="empty-state">
                    <FiFileText className="empty-icon" />
                    <p>{t('userProfile.noBlogs')}</p>
                    <Link to="/create-blog" className="create-link">
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
  );
};
