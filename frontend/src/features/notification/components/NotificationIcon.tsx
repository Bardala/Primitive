import { TbBell } from 'react-icons/tb';

import { useNotifications } from '../hooks/useNotifications';

import '../styles/notifications.css';

export const NotificationIcon = () => {
  const { unreadCount } = useNotifications();

  return (
    <div
      className="notification-badge-container"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <TbBell style={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
      {unreadCount > 0 && (
        <span
          className="notification-badge"
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ef4444',
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
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};
