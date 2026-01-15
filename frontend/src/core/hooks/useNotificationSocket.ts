import { SOCKET_EVENT } from '@nest/shared';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { socket } from '../utils';

export const useNotificationSocket = () => {
  useEffect(() => {
    const handleNotification = (data: any) => {
      // If we receive a notification, it means we are NOT in the room.
      // So simple toast is sufficient.
      if (data.type === 'MESSAGE_NEW') {
        const { message } = data;
        const msg = `New message from ${message.username}: ${message.content}`;
        toast.info(msg);
      }
    };

    socket.on(SOCKET_EVENT.NOTIFICATION, handleNotification);
    return () => {
      socket.off(SOCKET_EVENT.NOTIFICATION, handleNotification);
    };
  }, []);
};
