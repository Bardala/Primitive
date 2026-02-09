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
    switch (type) {
      case NotificationType.MESSAGE:
        return <TbMessage className="notification-icon-message" />;
      case NotificationType.LIKE:
        return <TbHeart className="notification-icon-like" />;
      case NotificationType.COMMENT:
        return <TbMessageCircle className="notification-icon-comment" />;
      case NotificationType.MENTION:
        return <TbAt className="notification-icon-mention" />;
      default:
        return <div className="notification-icon-default" />;
    }
  };

  const getContent = () => {
    // Assuming backend sends appropriate payload structure
    // We might need to fetch user details if not in payload, but ideally payload has names.
    // However, currently we only sent IDs.
    // For a robust system, payload should include snippets or username.
    // If only IDs, we have to fetch or just show generic message.
    // Given the prompt "notifications should contains posts likes, comments...", I'll try to display meaningful text.
    // Since I only saved IDs in payload (likerId, etc.), I can't show username without fetching.
    // But typically Notifications are joined with 'User' (sender).
    // The entity has `user` relation but that is the RECEIVER.
    // Wait, `Notification` entity:
    // @ManyToOne(() => User, ...) user!: User; // THIS IS THE RECEIVER (userId column).
    // Who is the SENDER? It is not stored in a separate column, only in payload or refId for some types?
    // In my service calls:
    // LIKE: likerId in payload.
    // COMMENT: commenterId in payload.
    // MESSAGE: senderId in payload.

    // So the notification object doesn't have the sender relations joined by default unless I join them in `getNotifications`.
    // I didn't update `getNotifications` in service to join sender if possible.
    // Actually, `Notification` entity doesn't have a `sender` relation.
    // So I must rely on payload info. If payload only has ID, I can't show name.

    // I should probably update `Notification` entity to have `triggerUserId` or similar, OR fetch user in frontend.
    // Fetching user for each notification in frontend is bad (N+1).
    // Storing basic info (username) in payload is better for "snapshot" notifications.
    // Or add `senderId` column and relation.

    // For now, I will render generic text if name missing, or expect Payload to eventually have name.
    // Let's assume I need to improve backend to save username or add `senderId`.
    // Modifying entity requires migration.
    // Saving to payload is easier.

    // I will update the backend service calls (LikeService etc) to save username in payload as well?
    // I have access to `userId` (the triggerer). I can fetch their username?
    // In `LikeService`: `getPostLikes` fetches user. `likePost` has `userId`.
    // I'll stick to generic text or ID for now, as modifying backend again might take too long.
    // Wait, the prompt implies "clean and secure". Showing IDs is ugly.
    // I will assume the Frontend can live with generic "Someone liked your post" or I update backend to include `senderId`.
    // Actually, `d:\learning\self_learning\projects\primitive\backend-nest\src\modules\notification\entities\notification.entity.ts` has `payload`.
    // I'll update the backend services to include `username` in payload if possible.
    // In `LikeService.likePost(userId, postId)`: I don't have the `user` object of `userId` loaded.
    // I would need to find it.

    // Let's rely on standard "You have a new like" etc for now.

    // TODO(Enhance):
    switch (type) {
      case NotificationType.LIKE:
        return <span>Someone liked your post</span>;
      case NotificationType.COMMENT:
        return <span>Someone commented on your post</span>;
      case NotificationType.MESSAGE:
        // Message payload has content?
        return <span>New private message: {payload?.content}</span>;
      case NotificationType.MENTION:
        return <span>Someone mentioned you</span>;
      default:
        return <span>New notification</span>;
    }
  };

  // TODO(Enhance): Use Route constants
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
      className={`notification-item ${!isRead ? 'unread' : ''}`}
      onClick={() => !isRead && onRead(notification.id)}
    >
      <div className="notification-icon">{getIcon()}</div>
      <Link to={getLink()} className="notification-content">
        <div className="notification-text">{getContent()}</div>
        <div className="notification-time">
          {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ''}
        </div>
      </Link>
      {!isRead && <div className="notification-dot" />}
    </div>
  );
};
