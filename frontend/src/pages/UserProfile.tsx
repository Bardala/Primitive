import {
  GetUserCardReq,
  GetUserCardRes,
  HOST,
  UserBlogsReq,
  UserBlogsRes,
  UserSpacesReq,
  UserSpacesRes,
} from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { BlogList } from '../components/BlogList';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch/auth';
import '../styles/user-profile.css';

// import { UserInfoCard } from '../components/UserInfoCard';

export const UserProfile = () => {
  const { currUser } = useAuthContext();
  const { id } = useParams();

  const userCardQuery = useQuery({
    queryKey: ['userCard', id],
    queryFn: () =>
      fetchFn<GetUserCardReq, GetUserCardRes>(
        `${HOST}/getUserCard/${id}`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    enabled: !!currUser?.jwt && !!id,
    onSuccess: data => console.log('userCard', data),
  });
  const userSpacesQuery = useQuery({
    queryKey: ['userSpaces', id],
    queryFn: () =>
      fetchFn<UserSpacesReq, UserSpacesRes>(
        `${HOST}/getUserSpaces/${id}`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    enabled: !!currUser?.jwt && !!id,
    onSuccess: data => console.log('userSpaces', data),
  });
  const userBlogsQuery = useQuery({
    queryKey: ['userBlogs', id],
    queryFn: () =>
      fetchFn<UserBlogsReq, UserBlogsRes>(
        `${HOST}/getUserBlogs/${id}`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    enabled: !!currUser?.jwt && !!id,
    onSuccess: data => console.log('userBlogs', data),
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

          {/* <UserInfoCard userCard={userCard} blogsLength={blogs?.length} /> */}

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
