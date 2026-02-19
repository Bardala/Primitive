import { useTranslation } from 'react-i18next';

import { useFollow } from '../hooks/useFollow';

export const FollowButton: React.FC<{ userId: string }> = ({ userId }) => {
  const { followMutation, unfollowMutation, isFollowing } = useFollow(userId);
  const { t } = useTranslation();

  return (
    <>
      {isFollowing ? (
        <button
          onClick={() => unfollowMutation.mutate()}
          disabled={unfollowMutation.isLoading}
          className="btn-primary rounded-lg bg-green-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
        >
          {t('followButton.following')}
        </button>
      ) : (
        <button
          onClick={() => followMutation.mutate()}
          className="btn-primary rounded-lg px-4 py-1.5 text-sm font-medium disabled:opacity-50"
          disabled={followMutation.isLoading}
        >
          {t('followButton.follow')}
        </button>
      )}
    </>
  );
};
