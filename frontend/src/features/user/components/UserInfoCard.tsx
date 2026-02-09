import { useAuthContext } from '@/core/context';
import { useCreatePrivateConversation } from '@/features/chat';

import { UserCard } from '@nest/shared';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChatDots } from 'react-icons/bs';
import { FiCalendar, FiFileText, FiMail, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useFollow } from '../hooks/useFollow';
import { FollowButton } from './FollowButton';
import { FollowersModal } from './FollowersModal';
import { UserStatus } from './UserStatus';

export const UserInfoCard: React.FC<{ userCard: UserCard; blogsLength: number }> = ({
  userCard,
  blogsLength,
}) => {
  const { currUser } = useAuthContext();
  const { followersQuery } = useFollow(userCard.id);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: createConversation, isLoading: isCreatingConvo } = useCreatePrivateConversation();

  const followersCount = followersQuery.data?.followers?.length || 0;

  const handleStartChat = () => {
    createConversation(
      { otherUserId: userCard.id },
      {
        onSuccess: conversation => {
          // Navigate to chat with the conversation ID
          navigate(`/chat?conversationId=${conversation.id}`);
        },
      }
    );
  };

  return (
    <>
      <div className="user-info-card">
        <div className="card-header">
          <h2>{t('userInfoCard.title')}</h2>
          {currUser && currUser.id !== userCard.id && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <FollowButton userId={userCard.id} />
              <button
                onClick={handleStartChat}
                disabled={isCreatingConvo}
                className="chat-button"
                title="Start private chat"
              >
                <BsChatDots size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="card-content">
          <div className="info-item">
            <FiMail className="info-icon" />
            <div className="info-content">
              <span className="info-label">{t('userInfoCard.email')}</span>
              <span className="info-value">{userCard.email}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-content" style={{ width: '100%' }}>
              <span className="info-label">Status</span>
              <UserStatus isOnline={userCard.isOnline} lastSeen={userCard.lastSeen} />
            </div>
          </div>

          <div className="info-item clickable" onClick={() => setIsFollowersModalOpen(true)}>
            <FiUsers className="info-icon" />
            <div className="info-content">
              <span className="info-label">{t('userInfoCard.followers')}</span>
              <span className="info-value">{followersCount}</span>
            </div>
          </div>

          <div className="info-item">
            <FiFileText className="info-icon" />
            <div className="info-content">
              <span className="info-label">{t('userInfoCard.blogs')}</span>
              <span className="info-value">{blogsLength < 10 ? blogsLength : '10+'}</span>
            </div>
          </div>

          <div className="info-item">
            <FiCalendar className="info-icon" />
            <div className="info-content">
              <span className="info-label">{t('userInfoCard.memberSince')}</span>
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
