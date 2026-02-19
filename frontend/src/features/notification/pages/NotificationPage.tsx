import { useTranslation } from 'react-i18next';

import { NotificationList } from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationPage = () => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border-light pb-4 dark:border-border-dark sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('notifications.title')}
          </h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">
              You have {unreadCount} unread notifications
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border-light bg-surface-light p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark md:p-6">
        <NotificationList
          notifications={notifications}
          onRead={markAsRead}
          onReadAll={markAllAsRead}
        />
      </div>
    </div>
  );
};
