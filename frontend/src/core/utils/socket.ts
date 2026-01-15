import { io } from 'socket.io-client';

import { HOST } from './config';

export const socket = io(HOST, {
  autoConnect: false,
});

export const connectSocket = (token: string) => {
  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
