import { GetUsersListReq, GetUsersListRes, HOST } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch/auth';
import '../styles/users-list.css';

export const UsersList = () => {
  const { currUser } = useAuthContext();

  const usersListQuery = useQuery(
    ['usersList'],
    () =>
      fetchFn<GetUsersListReq, GetUsersListRes>(
        `${HOST}/usersList`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    {
      enabled: !!currUser?.jwt,
      onError: err => console.log(err),
    }
  );

  const users = usersListQuery.data?.usersList;

  return (
    <div className="user-list">
      <h2>List of users</h2>
      {/* {error && <div className="error">error</div>} */}
      <ul>
        {users &&
          users.map(user => (
            <li key={user.id}>
              <Link to={`/u/${user.id}`}>
                <p className="username">{user.username}</p>
                {/* <div className="counts-container">
                  <p className="followers-count"> {user.followers.length} followers </p>
                  <p className="blogs-count">{user.blogs.length} blogs</p>
                  <p className="comments-count">{user.comments.length} comments</p>
                </div> */}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
