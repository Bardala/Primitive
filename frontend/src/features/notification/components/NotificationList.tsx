import { Notification } from '@nest/shared';

import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
}

export const NotificationList = ({ notifications, onRead, onReadAll }: NotificationListProps) => {
  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-text-secondary-light dark:text-text-secondary-dark">
        No notifications found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={onReadAll}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
        >
          Mark all as read
        </button>
      </div>
      <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
        {notifications.map(n => (
          <NotificationItem key={n.id} notification={n} onRead={onRead} />
        ))}
      </div>
    </div>
  );
};
