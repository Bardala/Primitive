import React, { useRef, useState } from 'react';
import { TbMessageCirclePlus } from 'react-icons/tb';

import { useClickOutside } from '../hooks/useClickOutside';
import { useGetAllMissedMsgs } from '../hooks/useProfileData';
import '../styles/notificationIcon.css';

export const NotificationIcon = () => {
  const { missedMsgs } = useGetAllMissedMsgs();
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const numOfMissedMsgs = missedMsgs?.reduce((acc, curr) => acc + curr.unread_count, 0) as number;

  useClickOutside(notificationRef, () => setShowNotification(false));

  return (
    <div className="notification-container" ref={notificationRef}>
      <TbMessageCirclePlus
        className={`notification-icon ${numOfMissedMsgs! > 0 ? 'active' : ''}`}
        onClick={() => setShowNotification(!showNotification)}
      />
      {numOfMissedMsgs > 0 && <span className="notification-badge">{numOfMissedMsgs}</span>}
    </div>
  );
};
