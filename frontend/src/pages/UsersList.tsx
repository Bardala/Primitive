import { GetUsersListRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { FollowButton } from '../components/FollowButton';
import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import '../styles/users-list.css';
import { userListApi } from '../utils/api';

export const UsersList = () => {
  const { currUser } = useAuthContext();
  const key = ['usersList'];

  const usersListQuery = useQuery<GetUsersListRes, ApiError>(key, userListApi(), {
    enabled: !!currUser?.jwt,
    refetchOnWindowFocus: false,
  });

  const users = usersListQuery.data?.usersList;

  return (
    <div className="user-list">
      <h2>List of users</h2>
      <ul>
        {users &&
          users.map(user => (
            <li key={user.id} className="user-icon">
              <Link to={`/u/${user.id}`}>
                <p className="username">{user.username}</p>
              </Link>
              {currUser?.id !== user.id && <FollowButton userId={user.id} />}
            </li>
          ))}
      </ul>
    </div>
  );
};
