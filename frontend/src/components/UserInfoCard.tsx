import { UserCard } from '@nest/shared';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { useAuthContext } from '../context/AuthContext';
import { useFollow } from '../hooks/useFollow';
import { FollowButton } from './FollowButton';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = props => {
  const { userCard } = props;
  let { currUser } = useAuthContext();
  const { followersQuery } = useFollow(userCard.id);

  return (
    <div className="user-information">
      <div className="card-header">
        <h2 className="page">{userCard.username} card</h2>
        {currUser && currUser.username !== userCard.username && (
          <FollowButton userId={userCard.id} />
        )}
      </div>
      {userCard.username === currUser?.username && <p>Email: {userCard.email}</p>}
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
