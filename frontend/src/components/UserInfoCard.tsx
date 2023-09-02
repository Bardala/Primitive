import { FollowUserRes, GetFollowersRes, UnFollowUserRes, UserCard } from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { followUserApi, unfollowUserApi, userFollowersApi } from '../utils/api';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = props => {
  const { userCard } = props;
  let { currUser } = useAuthContext();
  const key = ['followers', userCard.id];

  const followersQuery = useQuery<GetFollowersRes, ApiError>(key, userFollowersApi(userCard.id), {
    enabled: !!currUser?.jwt && !!userCard.id,
  });

  const followMutation = useMutation<FollowUserRes, ApiError>(followUserApi(userCard.id), {
    onSuccess: () => followersQuery.refetch(),
  });
  const unfollowMutation = useMutation<UnFollowUserRes, ApiError>(unfollowUserApi(userCard.id), {
    onSuccess: () => followersQuery.refetch(),
  });

  const isFollowing = followersQuery.data?.followers.some(follower => follower.id === currUser?.id);

  return (
    <div className="user-information">
      <div className="card-header">
        <h2 className="page">{userCard.username} card</h2>
        {currUser && currUser.username !== userCard.username && (
          <>
            {isFollowing ? (
              <button
                onClick={() => unfollowMutation.mutate()}
                disabled={unfollowMutation.isLoading}
                className="unfollow"
                style={{ backgroundColor: 'red' }}
              >
                Unfollow
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
        )}
      </div>
      {userCard.username === currUser?.username && (
        <>
          <p>Id: {userCard.id}</p>
          <p>Email: {userCard.email}</p>
        </>
      )}
      <p>Username: {userCard.username}</p>
      <p>Followers: {followersQuery.data?.followers?.length || 0}</p>
      {/* <p>Blogs: {blogsLength}</p> *this should have its own api */}
      <p>
        Joined from{' '}
        {formatDistanceToNow(new Date(userCard.timestamp), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
};
