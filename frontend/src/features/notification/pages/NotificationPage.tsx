import { useGetAllMissedMsgs } from '@/features/user';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import '../styles/notifications.css';

// TODO: Enhance the notification page to view new notifications
export const NotificationPage = () => {
  const { missedMsgs } = useGetAllMissedMsgs();
  const { t } = useTranslation();

  const numOfMissedMsgs = missedMsgs?.reduce((acc, curr) => acc + curr.unread_count, 0);

  return (
    <div className="notification-page">
      <div className="notification-header">
        <h1>{t('notifications.title')}</h1>
        {numOfMissedMsgs ? (
          <p>{t('notifications.youHaveNewMessages', { count: numOfMissedMsgs })}</p>
        ) : null}
      </div>

      <ul className="notification-body">
        {missedMsgs?.length ? (
          missedMsgs.map((msg, index) => (
            <li key={index}>
              <Link to={`/space/${msg.chat_spaceId}`} className="notification-item">
                <div>
                  {t('notifications.spaceMessage', {
                    count: msg.unread_count,
                    spaceName: msg.spaceName,
                  })}
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="no-messages">{t('notifications.noNewMessages')}</p>
        )}
      </ul>
    </div>
  );
};
