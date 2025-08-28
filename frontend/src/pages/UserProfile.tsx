import { Space } from '@nest/shared';
import { FormEvent, useState } from 'react';
import { FiFileText, FiSearch } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { UserInfoCard } from '../components/UserInfoCard';
import { useAuthContext } from '../context/AuthContext';
import { useProfileData } from '../hooks/useProfileData';
import '../styles/user-profile.css';

export const UserProfile = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();

  const { userCardQuery, userSpacesQuery, userBlogsQuery, isMyPage, isEnd } = useProfileData(id!);

  const blogs = userBlogsQuery.data?.pages.flatMap(page => page.blogs) || [];
  const spaces = isMyPage
    ? userSpacesQuery.data?.spaces
    : userSpacesQuery.data?.spaces.filter(space => space.status === 'public');
  const userCard = userCardQuery.data?.userCard;
  const [search, setSearch] = useState<Space[]>(spaces!);

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
      {userCardQuery.isError && (
        <div className="error-message">Something went wrong. Please try again later.</div>
      )}

      {userCardQuery.isLoading && <div className="loading-state">Loading user profile...</div>}

      {userCard && currUser && (
        <div className="user-profile">
          <header className="profile-header">
            <h1>{userCard.username}'s Profile</h1>
          </header>

          <div className="profile-content">
            <div className="user-info-section">
              <UserInfoCard userCard={userCard} blogsLength={blogs?.length || 0} />

              <div className="user-spaces-section">
                <div className="section-header">
                  <h2>Spaces</h2>
                  <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                      type="search"
                      placeholder="Search spaces..."
                      onChange={handleSearch}
                      className="search-input"
                    />
                  </div>
                </div>

                {userSpacesQuery.isError && (
                  <div className="error-message">Failed to load spaces</div>
                )}

                {userSpacesQuery.isLoading && (
                  <div className="loading-state">Loading spaces...</div>
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
                      <p>No spaces found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="user-blogs-section">
              <div className="section-header">
                <h2>Blogs</h2>
                <span className="blogs-count">{blogs.length} posts</span>
              </div>

              {userBlogsQuery.isError && <div className="error-message">Failed to load blogs</div>}

              {userBlogsQuery.isLoading && <div className="loading-state">Loading blogs...</div>}

              {blogs.length > 0 ? (
                <>
                  <BlogList posts={blogs} />
                  {!isEnd && (
                    <button
                      className="load-more-button"
                      onClick={() => userBlogsQuery.fetchNextPage()}
                      disabled={userBlogsQuery.isFetchingNextPage}
                    >
                      {userBlogsQuery.isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </button>
                  )}
                </>
              ) : (
                !userBlogsQuery.isLoading && (
                  <div className="empty-state">
                    <FiFileText className="empty-icon" />
                    <p>No blogs yet</p>
                    {isMyPage && (
                      <Link to="/create-blog" className="create-link">
                        Create your first blog
                      </Link>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
