import { HOST } from '@nest/shared';
import { io } from 'socket.io-client';

export const socket = io(HOST);
