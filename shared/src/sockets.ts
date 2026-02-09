export enum SOCKET_EVENT {
  CONNECTION = 'connection',
  JOIN_ROOM = 'join_room',
  FROM_CLIENT = 'from_client',
  FROM_SERVER = 'from_server',
  READ_MESSAGE = 'read_message',
  LEAVE_ROOM = 'leave_room',
  DISCONNECT = 'disconnect',
  NOTIFY_MISSED_MSG = 'notify_missed_msg',
  NOTIFICATION = 'notification',
  JOIN_PRIVATE_CONVO = 'JOIN_PRIVATE_CONVO',
  PRIVATE_MSG = 'PRIVATE_MSG',
  PRIVATE_MESSAGE_NEW = 'PRIVATE_MESSAGE_NEW',
}
