import { ROUTES } from '@/core/utils';

import { Notification, NotificationType } from '@nest/shared';

import { formatDistanceToNow } from 'date-fns';
import { TbAt, TbHeart, TbMessage, TbMessageCircle } from 'react-icons/tb';
import { Link } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const { type, payload, isRead, createdAt } = notification;

  const getIcon = () => {
    const baseClass =
      'h-10 w-10 flex items-center justify-center rounded-full bg-background-light dark:bg-background-dark shrink-0';
    switch (type) {
      case NotificationType.MESSAGE:
        return (
          <div className={`${baseClass} text-green-500`}>
            <TbMessage size={20} />
          </div>
        );
      case NotificationType.LIKE:
        return (
          <div className={`${baseClass} text-red-500`}>
            <TbHeart size={20} />
          </div>
        );
      case NotificationType.COMMENT:
        return (
          <div className={`${baseClass} text-blue-500`}>
            <TbMessageCircle size={20} />
          </div>
        );
      case NotificationType.MENTION:
        return (
          <div className={`${baseClass} text-amber-500`}>
            <TbAt size={20} />
          </div>
        );
      default:
        return <div className={baseClass} />;
    }
  };

  const getContent = () => {
    switch (type) {
      case NotificationType.LIKE:
        return (
          <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            Someone liked your post
          </span>
        );
      case NotificationType.COMMENT:
        return (
          <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            Someone commented on your post
          </span>
        );
      case NotificationType.MESSAGE:
        return (
          <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            New private message:{' '}
            <span className="font-normal text-text-secondary-light dark:text-text-secondary-dark">
              {payload?.content}
            </span>
          </span>
        );
      case NotificationType.MENTION:
        return (
          <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            Someone mentioned you
          </span>
        );
      default:
        return (
          <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            New notification
          </span>
        );
    }
  };

  // ... (getLink implementation remains the same)
  const getLink = () => {
    if (type === NotificationType.MESSAGE && payload?.conversationId) {
      return ROUTES.GET_CONVERSATION(payload.conversationId);
    }
    if (
      (type === NotificationType.LIKE ||
        type === NotificationType.COMMENT ||
        type === NotificationType.MENTION) &&
      payload?.blogId
    ) {
      const baseUrl = ROUTES.GET_BLOG_DETAILS(payload.blogId);
      return payload.commentId ? `${baseUrl}?commentId=${payload.commentId}` : baseUrl;
    }
    return '#';
  };

  return (
    <div
      className={`relative flex items-center gap-4 px-4 py-3 transition-colors hover:bg-background-light dark:hover:bg-background-dark/50 ${
        !isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
      }`}
      onClick={() => !isRead && onRead(notification.id)}
    >
      {getIcon()}
      <Link to={getLink()} className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="line-clamp-2">{getContent()}</div>
        <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark/70">
          {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ''}
        </div>
      </Link>
      {!isRead && <div className="h-2 w-2 rounded-full bg-primary-500 shrink-0" />}
    </div>
  );
};
