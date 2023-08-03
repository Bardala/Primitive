import {
  ENDPOINT,
  GetUserCardReq,
  GetUserCardRes,
  UserBlogsReq,
  UserBlogsRes,
  UserSpacesReq,
  UserSpacesRes,
} from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { UserInfoCard } from '../components/UserInfoCard';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import '../styles/user-profile.css';

export const UserProfile = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();

  const userCardQuery = useQuery({
    queryKey: ['userCard', id],
    queryFn: () =>
      fetchFn<GetUserCardReq, GetUserCardRes>(
        ENDPOINT.GET_USER_CARD,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    enabled: !!currUser?.jwt && !!id,
    onError: err => console.error(err),
  });

  const userSpacesQuery = useQuery({
    queryKey: ['userSpaces', id],
    queryFn: () =>
      fetchFn<UserSpacesReq, UserSpacesRes>(
        ENDPOINT.GET_USER_SPACES,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    enabled: !!currUser?.jwt && !!id,
    onError: err => console.error(err),
    refetchOnWindowFocus: false,
  });

  const userBlogsQuery = useQuery({
    queryKey: ['userBlogs', id],
    queryFn: () =>
      fetchFn<UserBlogsReq, UserBlogsRes>(
        ENDPOINT.GET_USER_BLOGS,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    enabled: !!currUser?.jwt && !!id,
    onError: err => console.error(err),
    refetchOnWindowFocus: false,
  });

  const blogs = userBlogsQuery.data?.blogs;
  const spaces = userSpacesQuery.data?.spaces;
  const userCard = userCardQuery.data?.userCard;

  return (
    <>
      {userCardQuery.isError && <div className="error">Something wrong</div>}
      {userCardQuery.isLoading && <p>Loading...</p>}
      {userCard && currUser && (
        <div className="user-profile">
          <h1>{userCard.username} Page</h1>

          <UserInfoCard userCard={userCard} blogsLength={blogs?.length || 0} />

          <div className="user-spaces">
            <h2>Spaces</h2>
            {userSpacesQuery.isError && <div className="error">Something wrong</div>}
            {userSpacesQuery.isLoading && <p>Loading...</p>}

            <div className="user-spaces-list">
              {spaces &&
                spaces.map(
                  space =>
                    space.id !== '1' && (
                      <div className="space" key={space.id}>
                        <Link to={`/space/${space.id}`} className="space-link">
                          <p>{space.name}</p>
                        </Link>
                      </div>
                    )
                )}
            </div>
          </div>

          {userBlogsQuery.isError && <div className="error">Something wrong</div>}
          {userBlogsQuery.isLoading && <p>Loading...</p>}

          <div>
            <h2>blogs</h2>
            {userBlogsQuery.isError && <div className="error">Something wrong</div>}
            {userBlogsQuery.isLoading && <p>Loading...</p>}

            {!!blogs ? (
              <BlogList blogs={blogs} />
            ) : (
              !userBlogsQuery.isLoading &&
              !userBlogsQuery.isError && (
                <div className="not-found">
                  <p>There isn't blogs</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};
