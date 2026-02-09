import { Notification } from '@nest/shared';

import { NotificationItem } from './NotificationItem';

import '../styles/notifications.css';

interface NotificationListProps {
  notifications: Notification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
}

export const NotificationList = ({ notifications, onRead, onReadAll }: NotificationListProps) => {
  if (!notifications.length) {
    return <div className="no-notifications">No notifications found</div>;
  }

  return (
    <div className="notification-list-container">
      <div className="notification-actions">
        <button onClick={onReadAll} className="mark-all-read-btn">
          Mark all as read
        </button>
      </div>
      <div className="notification-list">
        {notifications.map(n => (
          <NotificationItem key={n.id} notification={n} onRead={onRead} />
        ))}
      </div>
    </div>
  );
};
