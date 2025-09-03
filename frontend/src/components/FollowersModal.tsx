import { FiUsers, FiX } from 'react-icons/fi';

import { useAuthContext } from '../context/AuthContext';
import { useFollowers } from '../hooks/useFollowers';
import '../styles/followersModal.css';
import { FollowButton } from './FollowButton';
import { UserLink } from './UserLink';

interface FollowersModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FollowersModal: React.FC<FollowersModalProps> = ({ userId, isOpen, onClose }) => {
  const { currUser } = useAuthContext();
  const { followers, followersQuery } = useFollowers(userId);

  if (!isOpen || currUser?.id !== userId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FiUsers className="modal-icon" />
            Followers
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {followersQuery.isLoading ? (
            <div className="loading">Loading followers...</div>
          ) : followersQuery.isError ? (
            <div className="error">Error loading followers</div>
          ) : followers.length === 0 ? (
            <div className="empty-state">No followers yet</div>
          ) : (
            <div className="followers-list">
              {followers.map(follower => (
                <div key={follower.id} className="follower-item">
                  <UserLink userId={follower.id} username={follower.username} />
                  {currUser && currUser.id !== follower.id && <FollowButton userId={follower.id} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
