import { useClickOutside } from '@/core/hooks';

import { useRef, useState } from 'react';
import { TbBell } from 'react-icons/tb';
import { Link } from 'react-router-dom';

import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export const NotificationMenu = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  useClickOutside(notificationRef, () => setShowNotification(false));

  return (
    <div ref={notificationRef} className="relative z-50">
      <div
        className="relative cursor-pointer transition-transform hover:scale-110"
        onClick={() => setShowNotification(!showNotification)}
      >
        <TbBell
          className={`text-2xl transition-colors ${
            unreadCount > 0
              ? 'text-red-500'
              : 'text-text-secondary-light dark:text-text-secondary-dark'
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-surface-dark">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {showNotification && (
        <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl border border-border-light bg-surface-light shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-border-dark dark:bg-surface-dark">
          <div className="flex items-center justify-between border-b border-border-light px-4 py-3 dark:border-border-dark">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
              Notifications
            </h3>
            <Link
              to="/notifications"
              onClick={() => setShowNotification(false)}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
            >
              View All
            </Link>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {notifications.slice(0, 5).map(n => (
                  <NotificationItem key={n.id} notification={n} onRead={id => markAsRead(id)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                <TbBell size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
