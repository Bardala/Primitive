import { TbBell } from 'react-icons/tb';

import { useNotifications } from '../hooks/useNotifications';

export const NotificationIcon = () => {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative inline-block">
      <TbBell className="text-2xl align-middle" />
      {unreadCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[0.7rem] font-bold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};
