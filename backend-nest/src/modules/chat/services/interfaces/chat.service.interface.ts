import { CreateMsgReq, CreateMsgRes, DeleteMsgRes } from '../../dto';
import { ChatMessage } from '../../entities/chat-message.entity';

/**
 * IChatService interface
 * Responsibility: Handle chat message operations within spaces
 */
export interface IChatService {
  createMessage(userId: string, spaceId: string, req: CreateMsgReq): Promise<CreateMsgRes>;
  deleteMessage(userId: string, msgId: string): Promise<DeleteMsgRes>;
  getSpaceChat(spaceId: string, userId: string, limit?: number): Promise<ChatMessage[]>;
}
