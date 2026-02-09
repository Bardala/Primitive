import { useAuthContext } from '@/core/context';
import { HOST } from '@/core/utils';

import { Notification } from '@nest/shared';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getNotifications, markAllAsRead, markAsRead } from '../api';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { currUser: user } = useAuthContext();
  const token = user?.jwt;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!token || !user) return;

    const url = `${HOST}/api/v0/notifications/stream?token=${token}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = event => {
      try {
        const newNotification = JSON.parse(event.data) as Notification;
        setNotifications(prev => [newNotification, ...prev]);
      } catch (error) {
        console.error('Error parsing notification event', error);
      }
    };

    eventSource.onerror = error => {
      console.error('EventSource failed', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [token, user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        refetch: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
