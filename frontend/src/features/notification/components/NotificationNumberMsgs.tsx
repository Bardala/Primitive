import { useGetSpcMissedMsgs } from '@/features/spaces';

import { BiSolidBellRing } from 'react-icons/bi';

export const NotificationMsgsNumber: React.FC<{ spaceId: string }> = ({ spaceId }) => {
  const { numOfUnReadMsgs } = useGetSpcMissedMsgs(spaceId);
  const unRead = numOfUnReadMsgs.data?.numOfUnReadMsgs;

  if (unRead && unRead > 0) {
    return (
      <div className="flex items-center gap-1.5 ml-auto">
        <BiSolidBellRing className="text-red-500 animate-pulse" size={18} />
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
          {unRead > 99 ? '99+' : unRead}
        </span>
      </div>
    );
  }

  return null;
};
