import { ROUTES } from '@/core/utils';
import { Space, SpaceMember } from '@nest/shared';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const SpaceMembers: React.FC<{ users: SpaceMember[]; space: Space }> = ({
  users,
  space,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
        {t('spaceMembers.usersCount', { count: users.length })}
      </h3>
      <ul className="flex flex-col gap-2">
        {users &&
          users.map(user => (
            <li key={user.memberId}>
              <Link
                to={ROUTES.GET_USER_PROFILE(user.memberId)}
                className="flex items-center gap-3 rounded-xl border border-border-light bg-background-light p-3 transition-all hover:border-primary-500 hover:bg-primary-50 dark:border-border-dark dark:bg-background-dark dark:hover:border-primary-500/50 dark:hover:bg-primary-900/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {user.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {user.username || 'Unknown User'}
                  </span>
                  <div className="flex gap-1 text-sm">
                    {user.memberId === space.ownerId && (
                      <span title="Owner" className="text-yellow-500">
                        👑
                      </span>
                    )}
                    {user.isAdmin && user.memberId !== space.ownerId && (
                      <span title="Admin" className="text-blue-500">
                        👮‍♂️
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
