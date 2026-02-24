import { useAuthContext } from '@/core/context';

import { useTranslation } from 'react-i18next';
import { FiUserPlus, FiX } from 'react-icons/fi';

import { useFollowing } from '../hooks/useFollowing';
import { FollowButton } from './FollowButton';
import { UserLink } from './UserLink';

interface FollowingModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FollowingModal: React.FC<FollowingModalProps> = ({ userId, isOpen, onClose }) => {
  const { currUser } = useAuthContext();
  const { following, followingQuery } = useFollowing(userId);
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="flex h-full max-h-[500px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border-light bg-surface-light shadow-2xl dark:border-border-dark dark:bg-surface-dark"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4 dark:border-border-dark">
          <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
            <FiUserPlus className="text-primary-600 dark:text-primary-400" />
            {t('user.following') || 'Following'}
          </h3>
          <button
            className="rounded-full p-2 text-text-secondary-light transition-colors hover:bg-gray-100 hover:text-red-500 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-red-400"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
          {followingQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center p-10 text-text-secondary-light dark:text-text-secondary-dark">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              {t('followersModal.loading')}
            </div>
          ) : followingQuery.isError ? (
            <div className="p-8 text-center text-red-500 dark:text-red-400">
              {t('followersModal.error')}
            </div>
          ) : following.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center text-text-secondary-light dark:text-text-secondary-dark">
              <FiUserPlus size={48} className="mb-4 opacity-20" />
              <p>{t('user.noFollowing') || 'No following yet'}</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {following.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-primary-900/10"
                >
                  <UserLink userId={user.id} username={user.username} />
                  {currUser && currUser.id !== user.id && <FollowButton userId={user.id} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
