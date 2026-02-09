import { PrivateConversation, PrivateMessage, User } from '../types';

export interface CreatePrivateConvoReq {
  otherUserId: string;
}

export interface SendPrivateMsgReq {
  content: string;
}

export interface GetPrivateMsgsRes {
  messages: PrivateMessage[];
}

export interface GetConversationsRes {
  conversations: (PrivateConversation & {
    otherUser: User;
    lastMessage?: PrivateMessage;
    unreadCount: number;
  })[];
}
