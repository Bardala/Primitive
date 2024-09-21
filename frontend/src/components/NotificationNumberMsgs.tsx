import { BiSolidBellRing } from 'react-icons/bi';

import { useGetSpcMissedMsgs } from '../hooks/useSpace';

export const NotificationMsgsNumber: React.FC<{ spaceId: string }> = ({ spaceId }) => {
  const { numOfUnReadMsgs } = useGetSpcMissedMsgs(spaceId);
  const unRead = numOfUnReadMsgs.data?.numOfUnReadMsgs;

  if (unRead! > 0) {
    return (
      <>
        <BiSolidBellRing
          className="ring"
          style={{
            fontSize: '1.2rem',
            color: 'red',
            margin: '0 0.2rem',
          }}
        />
        <span
          className="unread-count"
          style={{
            backgroundColor: 'white',
            color: 'red',
            borderRadius: '50%',
            padding: '0 0.2rem',
            fontSize: '0.8rem',
          }}
        >
          {unRead}
        </span>
      </>
    );
  }

  return <></>;
};
