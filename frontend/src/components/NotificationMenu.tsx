import { useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useClickOutside } from '../hooks/useClickOutside';
import { useGetAllMissedMsgs } from '../hooks/useProfileData';
import '../styles/navBar.css';

export const NotificationMenu = () => {
  const { missedMsgs } = useGetAllMissedMsgs();
  const [showNotification, setShowNotification] = useState(false);
  const numOfMissedMegs = missedMsgs?.reduce((acc, curr) => acc + curr.unread_count, 0);
  const notificationRef = useRef<HTMLDivElement>(null);
  useClickOutside(notificationRef, () => setShowNotification(false));

  return (
    <div ref={notificationRef}>
      <div
        style={{
          cursor: 'pointer',
        }}
      >
        <FaBell
          className="notification-icon"
          style={numOfMissedMegs! > 0 ? { color: 'green' } : { color: 'black' }}
          onClick={() => setShowNotification(!showNotification)}
        />
        {numOfMissedMegs! > 0 && (
          <span
            className="notification-number"
            style={{
              color: 'green',
              fontWeight: 'bold',
            }}
          >
            {numOfMissedMegs}
          </span>
        )}
      </div>
      {showNotification && (
        <div className="notification-menu">
          <div className="notification-menu-header">
            <h3>Notifications</h3>
          </div>
          <div className="notification-menu-body">
            {missedMsgs?.map((m, index) => (
              <Link
                to={`/space/${m.chat_spaceId}`}
                key={index}
                onClick={() => setShowNotification(false)}
              >
                You have{' '}
                <span
                  style={{
                    color: 'green',
                    fontWeight: 'bold',
                  }}
                >
                  {m.unread_count}
                </span>{' '}
                new messages in space{' '}
                <span
                  style={{
                    color: 'green',
                    fontWeight: 'bold',
                  }}
                >
                  {m.spaceName}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
