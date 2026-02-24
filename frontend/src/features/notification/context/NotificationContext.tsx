import { useAuthContext } from '@/core/context';
import { HOST } from '@/core/utils';

import { Notification } from '@nest/shared';

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  // NOTE: jwt is intentionally stripped from localStorage on login (security).
  // Auth is cookie-based (HttpOnly). We gate on `user` (id/username) being
  // present, not on a jwt string.
  const isAuthenticated = !!user;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ── Refs that hold mutable state without causing re-renders ──────────────
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffAttempt = useRef(0);

  // ── REST fetch (cookies sent automatically via credentials: include) ─────
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('[Notifications] REST fetch failed:', err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Initial load whenever auth state changes
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();
  }, [isAuthenticated, fetchNotifications]);

  // 60-second polling fallback — keeps the badge accurate even if SSE drops
  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(id);
  }, [isAuthenticated, fetchNotifications]);

  // ── SSE connection ───────────────────────────────────────────────────────
  // Defined as a plain function stored in a ref so the `onerror` closure
  // always calls the latest version without stale captures.
  const connectRef = useRef<() => void>(() => {});

  connectRef.current = () => {
    // Tear down any previous connection
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    // No ?token= needed — the HttpOnly cookie is sent automatically.
    // withCredentials: true is required for cross-origin SSE (frontend:3000 → backend:4001).
    const url = `${HOST}/api/v0/notifications/stream`;
    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.onopen = () => {
      backoffAttempt.current = 0; // reset on clean connect
    };

    es.onmessage = event => {
      try {
        const parsed =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        // Ignore heartbeat pings (sent as { ping: true } — no `id` field)
        if (!parsed?.id) return;

        const incoming = parsed as Notification;

        setNotifications(prev => {
          if (prev.some(n => n.id === incoming.id)) return prev; // deduplicate
          return [incoming, ...prev];
        });
      } catch (err) {
        console.error('[Notifications] SSE parse error:', err);
      }
    };

    es.onerror = () => {
      // readyState: 0 = CONNECTING (browser auto-retrying), 2 = CLOSED
      if (es.readyState !== EventSource.CLOSED) return; // browser handles it

      // Connection truly closed — schedule our own reconnect with backoff
      esRef.current = null;

      const attempt = backoffAttempt.current;
      const delay = Math.min(1_000 * 2 ** attempt, 30_000); // 2s → 4s → … → 30s
      backoffAttempt.current = attempt + 1;

      console.warn(
        `[Notifications] SSE closed. Reconnecting in ${delay / 1000}s (attempt ${attempt + 1})`,
      );

      reconnectTimer.current = setTimeout(() => {
        connectRef.current(); // always calls the latest closure via ref
      }, delay);
    };
  };

  // Start / restart SSE whenever the user logs in or out
  useEffect(() => {
    if (!isAuthenticated) return;

    // Clear any pending reconnect from a previous session
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    backoffAttempt.current = 0;

    connectRef.current();

    return () => {
      // Cleanup on unmount or logout
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Write operations ─────────────────────────────────────────────────────
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('[Notifications] markAsRead failed:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('[Notifications] markAllAsRead failed:', err);
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
