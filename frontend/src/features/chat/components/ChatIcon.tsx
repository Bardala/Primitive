import { FiMail } from 'react-icons/fi';

import { useChatContext } from '../context/ChatContext';

export const ChatIcon = ({ className = '' }: { className?: string }) => {
  const { totalUnreadCount } = useChatContext();

  return (
    <div className={`relative inline-block ${className}`}>
      <FiMail className="text-2xl align-middle" />
      {totalUnreadCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[0.7rem] font-bold text-white">
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </span>
      )}
    </div>
  );
};
