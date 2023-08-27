import {
  ENDPOINT,
  FollowUserReq,
  FollowUserRes,
  GetFollowersReq,
  GetFollowersRes,
  UnFollowUserReq,
  UnFollowUserRes,
  UserCard,
} from '@nest/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = props => {
  const { userCard, blogsLength } = props;
  let { currUser } = useAuthContext();

  const followersQuery = useQuery<GetFollowersRes, ApiError>(
    ['followers', userCard.id],
    () =>
      fetchFn<GetFollowersReq, GetFollowersRes>(
        ENDPOINT.GET_FOLLOWERS,
        'GET',
        undefined,
        currUser?.jwt,
        [userCard.id]
      ),
    {
      enabled: !!currUser?.jwt && !!userCard.id,
      onError: err => console.error('err', err),
    }
  );

  const followMutation = useMutation<FollowUserRes, ApiError>(
    () =>
      fetchFn<FollowUserReq, FollowUserRes>(
        ENDPOINT.FOLLOW_USER,
        'POST',
        undefined,
        currUser?.jwt,
        [userCard.id]
      ),
    {
      onSuccess: () => followersQuery.refetch(),
      onError: err => console.error('followMutation error', err),
    }
  );
  const unfollowMutation = useMutation<UnFollowUserRes, ApiError>(
    () =>
      fetchFn<UnFollowUserReq, UnFollowUserRes>(
        ENDPOINT.UNFOLLOW_USER,
        'DELETE',
        undefined,
        currUser?.jwt,
        [userCard.id]
      ),
    {
      onSuccess: () => followersQuery.refetch(),
      onError: err => console.error('unfollowMutation error', err),
    }
  );

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
      {/* <p>Following: {userCard.following.length}</p> */}
      {/* <p>Spaces: {userCard.spaces.length}</p> */}
      <p>Blogs: {blogsLength}</p>
      {/* <p>Comments: {userCard.comments.length}</p> */}
      <p>
        Joined from{' '}
        {formatDistanceToNow(new Date(userCard.timestamp), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
};
