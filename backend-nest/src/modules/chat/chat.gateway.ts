import { Injectable, Logger, UseFilters } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENT } from '@nest/shared';
import { ChatService } from './services/chat.service';
import { LastReadService } from './services/last-read.service';
import { LastRead } from './entities';
import { SocketConfig } from 'src/config/socket.config';
import { CreateSocketMsgReq } from './dto';
import { WsExceptionsFilter } from 'src/common/filters/ws-exceptions.filter';
import { SocketUserData } from 'src/common/adapters/authenticated-socket.adapter';
import { PrivateChatService } from './services/private-chat.service';

import { UserActivityService } from '../user/services/user-activity.service';
import { PresenceService } from '../presence/presence.service';

interface ChatGatewayEvents {
  handleJoinRoom(socket: Socket, data: { spaceId: string }): void;
  handleLeaveRoom(socket: Socket, data: { spaceId: string }): Promise<void>;
  handleIncomingMsg(socket: Socket, msg: CreateSocketMsgReq): Promise<void>;
  handleMarkAsRead(socket: Socket, data: { spaceId: string; lastReadId: string }): Promise<void>;
  handlePrivateMsg(
    socket: Socket,
    data: { conversationId: string; content: string; toUserId: string },
  ): Promise<void>;
}

@Injectable()
@WebSocketGateway(SocketConfig)
@UseFilters(WsExceptionsFilter)
export class ChatGateway implements ChatGatewayEvents, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly lastReadService: LastReadService,
    private readonly privateChatService: PrivateChatService,
    private readonly presenceService: PresenceService,
    private readonly userActivityService: UserActivityService,
  ) {}

  handleConnection(socket: Socket) {
    const user: SocketUserData = socket.data?.user;
    if (user?.sub) {
      void socket.join(user.sub);

      // Update presence
      const isFirstConnection = this.presenceService.addConnection(user.sub);
      if (isFirstConnection) {
        // Broadcast that user is now online
        this.server.emit('USER_STATUS_CHANGE', {
          userId: user.sub,
          isOnline: true,
        });
      }
    }
    this.logger.log(
      `User ${user?.username || 'unknown'} (${user.sub}) connected with socket id: ${socket.id}`,
    );
  }

  async handleDisconnect(socket: Socket) {
    const user: SocketUserData = socket.data?.user;
    if (user?.sub) {
      // Update presence
      const isLastConnection = this.presenceService.removeConnection(user.sub);
      if (isLastConnection) {
        // Update lastActive in DB
        await this.userActivityService.updateLastActive(user.sub);

        // Broadcast that user is now offline
        this.server.emit('USER_STATUS_CHANGE', {
          userId: user.sub,
          isOnline: false,
          lastActive: new Date(),
        });
      }
    }
    this.logger.log(
      `User ${user?.username || 'unknown'} (${user?.sub}) disconnected: ${socket.id}`,
    );
  }

  /**
   * Handle user joining a room/space
   * @param socket - The connected socket
   * @param data - Contains spaceId (userId is extracted from JWT)
   */
  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  handleJoinRoom(socket: Socket, data: { spaceId: string }): void {
    try {
      const user: SocketUserData = socket.data?.user;

      if (!user) {
        throw new Error('User ID not found in socket context');
      }

      const { spaceId } = data;
      void socket.join(spaceId);
      this.logger.log(`User ${user?.username} (${user.sub}) joined room ${spaceId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error in handleJoinRoom: ${message}`);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('JOIN_PRIVATE_CONVO')
  handleJoinPrivateConvo(socket: Socket, data: { conversationId: string }): void {
    try {
      const user: SocketUserData = socket.data?.user;
      if (!user) throw new Error('User ID not found');

      const roomName = `private_convo_${data.conversationId}`;
      void socket.join(roomName);
      this.logger.log(`User ${user.username} joined private convo ${data.conversationId}`);
    } catch (error) {
      this.logger.error(error);
      socket.emit('error', { message: 'Failed to join private conversation' });
    }
  }

  @SubscribeMessage('PRIVATE_MSG')
  async handlePrivateMsg(
    socket: Socket,
    data: { conversationId: string; content: string; toUserId: string },
  ): Promise<void> {
    try {
      const user: SocketUserData = socket.data?.user;
      if (!user) throw new Error('User ID not found');

      const message = await this.privateChatService.createMessage(
        data.conversationId,
        user.sub,
        data.content,
      );

      const roomName = `private_convo_${data.conversationId}`;

      // Emit to conversation participants (including sender)
      this.server.to(roomName).emit('PRIVATE_MSG', message);

      // Notify recipient if online but not in conversation
      const socketsInRoom = await this.server.in(roomName).fetchSockets();
      const usersInRoom = new Set(socketsInRoom.map((s) => s.data.user.sub));

      if (!usersInRoom.has(data.toUserId)) {
        this.server.to(data.toUserId).emit(SOCKET_EVENT.NOTIFICATION, {
          type: 'PRIVATE_MESSAGE_NEW',
          message,
          conversationId: data.conversationId,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error in handlePrivateMsg: ${message}`);
      socket.emit('error', { message: 'Failed to send private message' });
    }
  }

  /**
   * Handle incoming chat messages
   * @param socket - The connected socket
   * @param data - Contains the chat message
   */
  @SubscribeMessage(SOCKET_EVENT.FROM_CLIENT)
  async handleIncomingMsg(socket: Socket, msg: CreateSocketMsgReq): Promise<void> {
    try {
      const user: SocketUserData = socket.data.user;

      this.logger.debug(`Message received in space ${msg.spaceId} from user ${user.sub}`);
      this.logger.debug(`Message received: ${JSON.stringify(msg)}`);

      const msgReq = {
        spaceId: msg.spaceId,
        username: user.username,
        content: msg.content,
      };

      const { message } = await this.chatService.createMessageFromSocket(msgReq);

      // Broadcast to all users in the space (including sender for confirmation if needed, but usually sender updates optimistally)
      this.server.to(message.spaceId).emit(SOCKET_EVENT.FROM_SERVER, message);

      // Handle Notifications
      // 1. Get all members of the space
      const members = await this.chatService.getSpaceMembers(message.spaceId);

      // 2. Get sockets currently in the room
      const socketsInRoom = await this.server.in(message.spaceId).fetchSockets();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const onlineUserIdsInRoom = new Set(socketsInRoom.map((s) => s.data.user.sub));

      // 3. Notify members who are NOT in the room
      for (const memberId of members) {
        // Skip sender
        if (memberId === user.sub) continue;

        // Skip if user is currently looking at the room
        if (onlineUserIdsInRoom.has(memberId)) continue;

        this.server.to(memberId).emit(SOCKET_EVENT.NOTIFICATION, {
          type: 'MESSAGE_NEW',
          message,
          spaceId: message.spaceId,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error in handleMessage: ${message}`);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  /**
   * Handle user marking messages as read
   * @param socket - The connected socket
   * @param data - Contains spaceId and lastReadId (userId from JWT)
   */
  @SubscribeMessage(SOCKET_EVENT.READ_MESSAGE)
  async handleMarkAsRead(
    socket: Socket,
    data: { spaceId: string; lastReadId: string },
  ): Promise<void> {
    try {
      const user: SocketUserData = socket.data?.user;

      if (!user) {
        throw new Error('User ID not found in socket context');
      }

      const { spaceId, lastReadId } = data;
      const lastRead = new LastRead(user.sub, spaceId, lastReadId);
      await this.lastReadService.updateLastRead(lastRead);
      this.logger.debug(
        `User ${user?.username} (${user?.sub}) marked messages as read in space ${spaceId}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error in handleMarkAsRead: ${message}`);
      socket.emit('error', { message: 'Failed to mark messages as read' });
    }
  }

  /**
   * Handle user leaving a room/space
   * @param socket - The connected socket
   * @param data - Contains spaceId and lastReadId (userId from JWT)
   */
  @SubscribeMessage(SOCKET_EVENT.LEAVE_ROOM)
  async handleLeaveRoom(
    socket: Socket,
    data: { spaceId: string; lastReadId: string },
  ): Promise<void> {
    try {
      const user: SocketUserData = socket.data?.user;

      if (!user) {
        throw new Error('User ID not found in socket context');
      }

      const { spaceId, lastReadId } = data;
      void socket.leave(spaceId);

      // Update last read message before leaving
      const lastRead = new LastRead(user.sub, spaceId, lastReadId);
      await this.lastReadService.updateLastRead(lastRead);

      this.logger.log(
        `User ${user?.username} (${user?.sub}) left room ${spaceId}, last read msg ${lastReadId}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error in handleLeaveRoom: ${message}`);
      socket.emit('error', { message: 'Failed to leave room' });
    }
  }
  /**
   * Broadcast read receipt to a private conversation
   */
  public sendReadReceipt(conversationId: string, readByUserId: string): void {
    const roomName = `private_convo_${conversationId}`;
    this.server.to(roomName).emit('PRIVATE_MSG_READ', {
      conversationId,
      readByUserId,
      readAt: new Date(),
    });
  }
}
