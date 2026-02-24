import { useAuthContext } from '@/core/context';

import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useFollowing } from '../hooks/useFollow';
import { UserLink } from './UserLink';

export const FollowedUsersList: React.FC = () => {
  const { currUser } = useAuthContext();
  const { data, isLoading } = useFollowing(currUser?.id || '');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`/u/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  const followings = data?.followers || [];

  if (followings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-text-secondary-light dark:text-text-secondary-dark font-medium">
        <p className="text-sm opacity-60">{t('user.noFollowings') || 'No followed users yet'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {followings.map(user => (
        <div
          key={user.id}
          onClick={() => handleUserClick(user.id)}
          className="flex items-center justify-between p-4 transition-all cursor-pointer border-b border-border-light/40 dark:border-border-dark/40 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
              <UserLink userId={user.id}>
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                  {user.username[0].toUpperCase()}
                </div>
              </UserLink>
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-light bg-green-500 dark:border-surface-dark" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark truncate">
                {user.username}
              </span>
              <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark font-medium leading-tight mt-0.5">
                {user.isOnline ? (
                  <span className="text-green-500 font-bold uppercase tracking-wider">
                    {t('user.online') || 'Active Now'}
                  </span>
                ) : user.lastSeen ? (
                  <span className="opacity-70">
                    {t('user.lastSeen') || 'Last seen'}{' '}
                    {formatDistanceToNow(new Date(user.lastSeen))} {t('user.ago') || 'ago'}
                  </span>
                ) : (
                  <span className="opacity-50">{t('user.offline') || 'Offline'}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
