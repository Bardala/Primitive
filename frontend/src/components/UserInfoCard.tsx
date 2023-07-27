import {
  FollowUserReq,
  FollowUserRes,
  GetFollowersReq,
  GetFollowersRes,
  HOST,
  UnFollowUserReq,
  UnFollowUserRes,
  UserCard,
} from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch/auth';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = props => {
  const { userCard, blogsLength } = props;
  let { currUser } = useAuthContext();

  const followersQuery = useQuery(
    ['followers', userCard.id],
    () =>
      fetchFn<GetFollowersReq, GetFollowersRes>(
        `${HOST}/getFollowers/${userCard.id}`,
        'GET',
        undefined,
        currUser?.jwt
      ),
    {
      enabled: !!currUser?.jwt && !!userCard.id,
      onError: err => console.error('err', err),
    }
  );

  const followMutation = useMutation(
    () =>
      fetchFn<FollowUserReq, FollowUserRes>(
        `${HOST}/followUser/${userCard.id}`,
        'POST',
        undefined,
        currUser?.jwt
      ),
    {
      onSuccess: () => followersQuery.refetch(),
      onError: err => console.error('followMutation error', err),
    }
  );
  const unfollowMutation = useMutation(
    () =>
      fetchFn<UnFollowUserReq, UnFollowUserRes>(
        `${HOST}/unfollowUser/${userCard.id}`,
        'DELETE',
        undefined,
        currUser?.jwt
      ),
    {
      onSuccess: () => followersQuery.refetch(),
      onError: err => console.error('unfollowMutation error', err),
    }
  );

  const isFollowing = () => {
    if (!currUser) return false;
    return followersQuery.data?.followers.some(follower => follower.id === currUser?.id);
  };

  return (
    <div className="user-information">
      <div className="card-header">
        <h2 className="page">{userCard.username} card</h2>
        {currUser && currUser.username !== userCard.username && (
          <>
            {/* {followMutation.isError && <p className="error">{STATE.ERROR}</p>} */}
            {/* {unfollowMutation && <p className="error">{STATE.ERROR}</p>} */}
            {isFollowing() ? (
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

      <p>Username: {userCard.username}</p>
      <p>Email: {userCard.email}</p>
      <p>Followers: {followersQuery.data?.followers?.length || 0}</p>
      {/* <p>Following: {userCard.following.length}</p> */}
      {/* <p>Spaces: {userCard.spaces.length}</p> */}
      <p>Blogs: {blogsLength}</p>
      {/* <p>Comments: {userCard.comments.length}</p> */}
      <p>
        From{' '}
        {formatDistanceToNow(new Date(userCard.timestamp), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
};
