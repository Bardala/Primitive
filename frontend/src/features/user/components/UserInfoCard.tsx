import { useAuthContext } from '@/core/context';
import { useSideBar } from '@/core/context/SideBarContext';
import { useCreatePrivateConversation } from '@/features/chat';

import { UserCard } from '@nest/shared';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChatDots } from 'react-icons/bs';
import { FiCalendar, FiFileText, FiMail, FiUsers } from 'react-icons/fi';

import { useFollow } from '../hooks/useFollow';
import { FollowButton } from './FollowButton';
import { FollowersModal } from './FollowersModal';
import { UserStatus } from './UserStatus';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = ({
  userCard,
  blogsLength,
}) => {
  const { currUser } = useAuthContext();
  const { dispatch } = useSideBar();
  const { followersQuery } = useFollow(userCard.id);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const { t } = useTranslation();
  const { mutate: createConversation, isLoading: isCreatingConvo } = useCreatePrivateConversation();

  const followersCount = followersQuery.data?.followers?.length || 0;

  const handleStartChat = () => {
    createConversation(
      { otherUserId: userCard.id },
      {
        onSuccess: conversation => {
          dispatch({
            type: 'setActiveChat',
            payload: { id: conversation.id, type: 'private', name: userCard.username },
          });
        },
      }
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-border-light bg-surface-light p-6 shadow-md dark:border-border-dark dark:bg-surface-dark">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('userInfoCard.title')}
          </h2>
          {currUser && currUser.id !== userCard.id && (
            <div className="flex items-center gap-2">
              <FollowButton userId={userCard.id} />
              <button
                onClick={handleStartChat}
                disabled={isCreatingConvo}
                className="flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-50 dark:border-primary-800 dark:bg-surface-dark dark:text-primary-400 dark:hover:bg-primary-900/20"
                title={t('userInfoCard.message', 'Message')}
              >
                <BsChatDots size={18} />
                <span className="hidden sm:inline">Message</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100/50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
              <FiMail size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t('userInfoCard.email')}
              </span>
              <span className="text-sm text-text-primary-light dark:text-text-primary-dark break-all">
                {userCard.email}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-full">
              <span className="mb-1 block text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Status
              </span>
              <UserStatus isOnline={userCard.isOnline} lastSeen={userCard.lastSeen} />
            </div>
          </div>

          <div
            className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 -ml-2 transition-colors hover:bg-gray-50 dark:hover:bg-primary-900/10"
            onClick={() => setIsFollowersModalOpen(true)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100/50 text-secondary-600 transition-colors group-hover:bg-secondary-200/50 dark:bg-secondary-900/20 dark:text-secondary-400">
              <FiUsers size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t('userInfoCard.followers')}
              </span>
              <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {followersCount}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100/50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400">
              <FiFileText size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t('userInfoCard.blogs')}
              </span>
              <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {blogsLength < 10 ? blogsLength : '10+'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <FiCalendar size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                {t('userInfoCard.memberSince')}
              </span>
              <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                {formatDistanceToNow(new Date(userCard.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <FollowersModal
        userId={userCard.id}
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
      />
    </>
  );
};
