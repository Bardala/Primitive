import { Link } from 'react-router-dom';

import { useGetAllMissedMsgs } from '../hooks/useProfileData';
import '../styles/notifications.css';

export const NotificationPage = () => {
  const { missedMsgs } = useGetAllMissedMsgs();
  const numOfMissedMsgs = missedMsgs?.reduce((acc, curr) => acc + curr.unread_count, 0);

  return (
    <div className="notification-page">
      <div className="notification-header">
        <h1>Notifications</h1>
        {numOfMissedMsgs ? <p>You have {numOfMissedMsgs} new messages</p> : <></>}
      </div>

      <ul className="notification-body">
        {missedMsgs?.length ? (
          missedMsgs.map((msg, index) => (
            <li>
              <Link to={`/space/${msg.chat_spaceId}`} key={index} className="notification-item">
                <div>
                  You have <span className="notification-count">{msg.unread_count}</span> new
                  messages in <span className="notification-space-name">{msg.spaceName}</span>.
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="no-messages">No new messages</p>
        )}
      </ul>
    </div>
  );
};
