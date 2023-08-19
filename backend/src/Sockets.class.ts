import { Server, Socket } from 'socket.io';
import http from 'http';

class Connection {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    socket.on('chat message', msg => {
      console.log(msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  }
}

export function initSockets(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('User Connected', socket.id);
    new Connection(io, socket);
  });
}
