import { useFollow } from '../hooks/useFollow';

export const FollowButton: React.FC<{ userId: string }> = props => {
  const { userId } = props;
  const { followMutation, unfollowMutation, isFollowing } = useFollow(userId);

  return (
    <>
      {isFollowing ? (
        <button
          onClick={() => unfollowMutation.mutate()}
          disabled={unfollowMutation.isLoading}
          className="unfollow"
          style={{ backgroundColor: '#41c541' }}
        >
          Following
        </button>
      ) : (
        <button
          onClick={() => followMutation.mutate()}
          className="follow"
          disabled={followMutation.isLoading}
        >
          Follow
        </button>
      )}
    </>
  );
};
