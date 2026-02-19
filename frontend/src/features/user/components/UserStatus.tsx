import { formatDistanceToNow } from 'date-fns';
import React from 'react';

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
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-surface-dark"></span>
        {showText && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Online</span>
        )}
      </div>
    );
  }

  if (lastSeen) {
    const lastSeenDate = typeof lastSeen === 'string' ? new Date(lastSeen) : lastSeen;
    const timeAgo = formatDistanceToNow(lastSeenDate, { addSuffix: true });

    return (
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
        {showText && (
          <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            Last seen {timeAgo}
          </span>
        )}
      </div>
    );
  }

  return null;
};
