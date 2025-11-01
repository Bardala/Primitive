import { PrivateMessage } from '@nest/shared';

export interface PrivateMessageDao {
  sendDirectMessage(message: PrivateMessage): Promise<void>;
  fetchDirectMessage(messageId: string): Promise<PrivateMessage | undefined>;
  listConversationHistory(
    conversationId: string,
    limit?: number,
    offset?: number
  ): Promise<PrivateMessage[]>;
  editDirectMessage(messageId: string, content: string): Promise<void>;
  removeDirectMessage(messageId: string): Promise<void>;
  clearConversationHistory(conversationId: string): Promise<void>;
  getLatestDirectMessageId(conversationId: string): Promise<string | undefined>;
}
