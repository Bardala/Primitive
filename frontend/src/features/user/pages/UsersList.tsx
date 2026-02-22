import { MainLayout } from '@/app/layout';
import { useAuthContext } from '@/core/context';
import { ApiError } from '@/core/services';
import { userListApi } from '@/core/utils';

import { GetUsersListRes } from '@nest/shared';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { UserLink } from '../components';
import { FollowButton } from '../components/FollowButton';

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
    <MainLayout>
    <div className="mx-auto max-w-4xl w-full p-6">
      <h2 className="mb-6 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
        {t('usersList.title')}
      </h2>

      {usersListQuery.isError && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {t('usersList.error')}
        </div>
      )}

      {usersListQuery.isLoading && (
        <div className="py-10 text-center text-text-secondary-light dark:text-text-secondary-dark">
          {t('usersList.loading')}
        </div>
      )}

      <ul className="divide-y divide-border-light rounded-2xl border border-border-light bg-surface-light shadow-sm dark:divide-border-dark dark:border-border-dark dark:bg-surface-dark">
        {users &&
          users.map(user => (
            <li
              key={user.id}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-primary-900/10"
            >
              <UserLink userId={user.id} username={user.username} />
              {currUser?.id !== user.id && <FollowButton userId={user.id} />}
            </li>
          ))}
      </ul>
    </div>
    </MainLayout>
  );
};
