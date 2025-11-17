import { useAuthContext } from '@/core/context';
import { ApiError } from '@/core/services';
import { userListApi } from '@/core/utils';

import { GetUsersListRes } from '@nest/shared';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { UserLink } from '../components';
import { FollowButton } from '../components/FollowButton';

import '../styles/users-list.css';

export const UsersList = () => {
  const { currUser } = useAuthContext();
  const { t } = useTranslation();
  const key = ['usersList'];

  const usersListQuery = useQuery<GetUsersListRes, ApiError>(key, () => userListApi(), {
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const users = usersListQuery.data?.usersList;

  return (
    <div className="user-list">
      <h2>{t('usersList.title')}</h2>

      {usersListQuery.isError && <div className="error-message">{t('usersList.error')}</div>}

      {usersListQuery.isLoading && <div className="loading-state">{t('usersList.loading')}</div>}

      <ul>
        {users &&
          users.map(user => (
            <li key={user.id} className="user-icon">
              <UserLink userId={user.id} username={user.username} />
              {currUser?.id !== user.id && <FollowButton userId={user.id} />}
            </li>
          ))}
      </ul>
    </div>
  );
};
