import { UserCard } from '@nest/shared';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FiCalendar, FiFileText, FiMail, FiUsers } from 'react-icons/fi';

import { useAuthContext } from '../context/AuthContext';
import { useFollow } from '../hooks/useFollow';
import { FollowButton } from './FollowButton';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = ({
  userCard,
  blogsLength,
}) => {
  const { currUser } = useAuthContext();
  const { followersQuery } = useFollow(userCard.id);

  return (
    <div className="user-info-card">
      <div className="card-header">
        <h2>User Information</h2>
        {currUser && currUser.id !== userCard.id && <FollowButton userId={userCard.id} />}
      </div>

      <div className="card-content">
        <div className="info-item">
          <FiMail className="info-icon" />
          <div className="info-content">
            <span className="info-label">Email</span>
            <span className="info-value">{userCard.email}</span>
          </div>
        </div>

        <div className="info-item">
          <FiUsers className="info-icon" />
          <div className="info-content">
            <span className="info-label">Followers</span>
            <span className="info-value">{followersQuery.data?.followers?.length || 0}</span>
          </div>
        </div>

        <div className="info-item">
          <FiFileText className="info-icon" />
          <div className="info-content">
            <span className="info-label">Blogs</span>
            <span className="info-value">{blogsLength}</span>
          </div>
        </div>

        <div className="info-item">
          <FiCalendar className="info-icon" />
          <div className="info-content">
            <span className="info-label">Member since</span>
            <span className="info-value">
              {formatDistanceToNow(new Date(userCard.timestamp), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
