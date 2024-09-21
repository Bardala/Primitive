import { ChatMessage } from '@nest/shared';

export interface ChatDao {
  createMessage(message: ChatMessage): Promise<void>;
  getMessage(messageId: string): Promise<ChatMessage>;
  getLastMsgId(spaceId: string): Promise<string>;
  deleteMessage(messageId: string): Promise<void>;
}
