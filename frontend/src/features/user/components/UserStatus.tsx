import { formatDistanceToNow } from 'date-fns';
import React from 'react';

import './user-status.css';

interface UserStatusProps {
  isOnline?: boolean;
  lastSeen?: Date | string;
  showText?: boolean;
}

export const UserStatus: React.FC<UserStatusProps> = ({
  isOnline = false,
  lastSeen,
  showText = true,
}) => {
  if (isOnline) {
    return (
      <div className="user-status user-status--online">
        <span className="user-status__indicator"></span>
        {showText && <span className="user-status__text">Online</span>}
      </div>
    );
  }

  if (lastSeen) {
    const lastSeenDate = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
    const timeAgo = formatDistanceToNow(lastSeenDate, { addSuffix: true });

    return (
      <div className="user-status user-status--offline">
        <span className="user-status__indicator"></span>
        {showText && <span className="user-status__text">Last seen {timeAgo}</span>}
      </div>
    );
  }

  return null;
};
