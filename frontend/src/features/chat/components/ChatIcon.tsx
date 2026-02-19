import { TbMessage } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { useChatContext } from '../context/ChatContext';

export const ChatIcon = () => {
  const { totalUnreadCount } = useChatContext();
  const navigate = useNavigate();

  return (
    <div
      className="relative inline-block cursor-pointer transition-transform hover:scale-110"
      onClick={() => navigate('/chat')}
    >
      <TbMessage className="text-2xl text-text-secondary-light transition-colors hover:text-primary-600 dark:text-text-secondary-dark dark:hover:text-primary-400" />
      {totalUnreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-surface-dark">
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </span>
      )}
    </div>
  );
};
