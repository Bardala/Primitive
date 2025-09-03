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
          className="follow-button unfollow"
          style={{ backgroundColor: '#41c541' }}
        >
          {t('followButton.following')}
        </button>
      ) : (
        <button
          onClick={() => followMutation.mutate()}
          className="follow-button follow"
          disabled={followMutation.isLoading}
        >
          {t('followButton.follow')}
        </button>
      )}
    </>
  );
};
