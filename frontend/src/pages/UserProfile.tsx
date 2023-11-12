import { Space } from '@nest/shared';
import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { NotificationNumberMsgs } from '../components/NotificationNumberMsgs';
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

  const handleSearch = (e: MouseEvent | FormEvent) => {
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
    <>
      {userCardQuery.isError && <div className="error">Something wrong</div>}
      {userCardQuery.isLoading && <p>Loading...</p>}
      {userCard && currUser && (
        <div className="user-profile">
          <h1>{userCard.username} Page</h1>

          <div className="user-info">
            <UserInfoCard userCard={userCard} blogsLength={blogs?.length || 0} />
            <div className="user-spaces">
              <h2>Spaces</h2>
              {userSpacesQuery.isError && <div className="error">Something wrong</div>}
              {userSpacesQuery.isLoading && <p>Loading...</p>}
              <input
                type="search"
                placeholder="search"
                onChange={handleSearch}
                className="search-curr-spaces"
              />
              <div className="user-spaces-list">
                {spaces &&
                  (search || spaces).map(
                    space =>
                      space.id !== '1' && (
                        <div className="space" key={space.id}>
                          <Link to={`/space/${space.id}`} className="space-link">
                            <p>{space.name}</p> <NotificationNumberMsgs spaceId={space.id} />
                          </Link>
                        </div>
                      )
                  )}
              </div>
            </div>
          </div>

          {userBlogsQuery.isError && <div className="error">Something wrong</div>}
          {userBlogsQuery.isLoading && <p>Loading...</p>}

          {userBlogsQuery.isError && <div className="error">Something wrong</div>}
          {userBlogsQuery.isLoading && <p>Loading...</p>}

          {!!blogs?.length && (
            <>
              <BlogList posts={blogs} />
              <button
                hidden={isEnd}
                disabled={isEnd}
                onClick={() => userBlogsQuery.fetchNextPage()}
              >
                Load More
              </button>
            </>
          )}

          {blogs.length === 0 && !userBlogsQuery.isLoading && !userBlogsQuery.isError && (
            <div className="not-found">
              <p>There isn't blogs</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
