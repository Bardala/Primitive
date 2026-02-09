import { useClickOutside } from '@/core/hooks';

import { useRef, useState } from 'react';
import { TbBell } from 'react-icons/tb';
import { Link } from 'react-router-dom';

import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

import '../../../app/styles/navBar.css';
import '../styles/notifications.css';

export const NotificationMenu = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  useClickOutside(notificationRef, () => setShowNotification(false));

  return (
    <div ref={notificationRef} className="notification-menu-container">
      <div
        className="notification-trigger"
        onClick={() => setShowNotification(!showNotification)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <TbBell
          className="notification-icon-trigger"
          style={{ fontSize: '1.5rem', color: unreadCount > 0 ? '#ef4444' : '#dbd8d8' }}
        />
        {unreadCount > 0 && (
          <span
            className="notification-badge"
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
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

      {showNotification && (
        <div className="notification-menu" style={{ width: '320px', right: 0 }}>
          <div
            className="notification-menu-header"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <h3>Notifications</h3>
            <Link
              to="/notifications"
              onClick={() => setShowNotification(false)}
              style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none' }}
            >
              View All
            </Link>
          </div>
          <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications
                .slice(0, 5)
                .map(n => (
                  <NotificationItem key={n.id} notification={n} onRead={id => markAsRead(id)} />
                ))
            ) : (
              <p style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                No new notifications
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
