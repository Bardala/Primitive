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
  markAsRead(userId: string, spaceId: string, lastReadId?: string): Promise<void>;
  createMessageFromSocket(message: any): Promise<CreateMsgRes>;
  getSpaceMembers(spaceId: string): Promise<string[]>;
  getUnifiedConversations(userId: string): Promise<{ spaces: any[] }>;
  toggleMute(userId: string, spaceId: string, isMuted?: boolean): Promise<void>;
  updateLastSoundPlayed(userId: string, spaceId: string): Promise<void>;
}
