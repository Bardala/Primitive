import { UserCard } from '@nest/shared';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { FiCalendar, FiFileText, FiMail, FiUsers } from 'react-icons/fi';

import { useAuthContext } from '../context/AuthContext';
import { useFollow } from '../hooks/useFollow';
import { FollowButton } from './FollowButton';
import { FollowersModal } from './FollowersModal';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = ({
  userCard,
  blogsLength,
}) => {
  const { currUser } = useAuthContext();
  const { followersQuery } = useFollow(userCard.id);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);

  const followersCount = followersQuery.data?.followers?.length || 0;

  return (
    <>
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

          <div className="info-item clickable" onClick={() => setIsFollowersModalOpen(true)}>
            <FiUsers className="info-icon" />
            <div className="info-content">
              <span className="info-label">Followers</span>
              <span className="info-value">{followersCount}</span>
            </div>
          </div>

          <div className="info-item">
            <FiFileText className="info-icon" />
            <div className="info-content">
              <span className="info-label">Blogs</span>
              <span className="info-value">{blogsLength < 10 ? blogsLength : '10+'}</span>
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

      <FollowersModal
        userId={userCard.id}
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
      />
    </>
  );
};
