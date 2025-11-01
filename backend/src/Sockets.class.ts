import { ChatMessage, LastReadMsg, SOCKET_EVENT } from '@nest/shared';
import http from 'http';
import { Server, Socket } from 'socket.io';

import { DataStoreDao } from './dataStore';
import { Origin, logger } from './utils';

class Connection {
  private db: DataStoreDao;
  io: Server;
  socket: Socket;
  spaceId: string | string[] | undefined;

  constructor(io: Server, socket: Socket, db: DataStoreDao) {
    this.io = io;
    this.socket = socket;
    this.db = db;

    socket.on(SOCKET_EVENT.JOIN_ROOM, this.handleJoinRoom.bind(this));
    socket.on(SOCKET_EVENT.FROM_CLIENT, this.handleMsgs.bind(this));
    socket.on(SOCKET_EVENT.READ_MESSAGE, this.setLastReadMsg.bind(this));
    socket.on(SOCKET_EVENT.LEAVE_ROOM, this.handleLeaveRoom.bind(this));
    socket.on(SOCKET_EVENT.DISCONNECT, this.handleDisconnect.bind(this));
  }

  private handleJoinRoom(data: { spaceId: string; userId: string }) {
    this.spaceId = data.spaceId;
    this.socket.data.userId = data.userId;
    this.socket.join(data.spaceId);
    logger.info(`User ${data.userId} joined room ${data.spaceId}`);
  }

  private handleMsgs(data: { message: ChatMessage }) {
    this.socket.broadcast.to(data.message.spaceId).emit(SOCKET_EVENT.FROM_SERVER, data.message);
  }

  private handleDisconnect() {
    logger.info('user disconnected');
  }

  private async setLastReadMsg(data: LastReadMsg) {
    await this.db.updateLastRead(data);
  }

  private async handleLeaveRoom(data: LastReadMsg) {
    this.socket.leave(data.spaceId);
    // await this.db.updateLastReadMsg(data);
    logger.info(`user ${data.userId} left room ${data.spaceId}, last read msg ${data.msgId}`);
  }
}

export function initSockets(server: http.Server, db: DataStoreDao) {
  const io = new Server(server, {
    cors: {
      origin: Origin,
      methods: ['GET', 'POST'],
    },
  });

  io.on(SOCKET_EVENT.CONNECTION, (socket: any) => {
    logger.info('User Connected with socket id: ', socket.id);
    new Connection(io, socket, db);
  });
}
