import { TbMessage } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { useChatContext } from '../context/ChatContext';

export const ChatIcon = () => {
  const { totalUnreadCount } = useChatContext();
  const navigate = useNavigate();

  return (
    <div
      className="notification-badge-container"
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
      onClick={() => navigate('/chat')}
    >
      <TbMessage style={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
      {totalUnreadCount > 0 && (
        <span
          className="notification-badge"
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#10b981', // Green for chat
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '18px',
            height: '18px',
          }}
        >
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </span>
      )}
    </div>
  );
};
