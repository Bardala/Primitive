import { SOCKET_EVENT } from '@nest/shared';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { socket } from '../utils';

// TODO: Update types in shared folder
export const useNotificationSocket = () => {
  useEffect(() => {
    const handleNotification = (data: any) => {
      // We only show toasts for private messages now.
      // Space message notifications are handled silently (unread count + sound) in ChatContext.
      if (data.type === 'PRIVATE_MESSAGE_NEW') {
        const { message } = data;
        const msg = `New private message from ${message.senderName || 'someone'}: ${
          message.content
        }`;
        toast.info(msg);
      }
    };

    socket.on(SOCKET_EVENT.NOTIFICATION, handleNotification);
    return () => {
      socket.off(SOCKET_EVENT.NOTIFICATION, handleNotification);
    };
  }, []);
};
