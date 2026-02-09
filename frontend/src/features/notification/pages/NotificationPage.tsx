import { useTranslation } from 'react-i18next';

import { NotificationList } from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';

import '../styles/notifications.css';

export const NotificationPage = () => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="notification-page">
      <div className="notification-header">
        <h1>{t('notifications.title')}</h1>
        {unreadCount > 0 && (
          <p className="notification-count">You have {unreadCount} unread notifications</p>
        )}
      </div>

      <div className="notification-body">
        <NotificationList
          notifications={notifications}
          onRead={markAsRead}
          onReadAll={markAllAsRead}
        />
      </div>
    </div>
  );
};
