import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from 'src/modules/chat/entities/chat-message.entity';
import { PrivateConversation } from 'src/modules/chat/entities/private-conversation.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * Chat validator
 * Handles validation for Chat entities (ChatMessage, PrivateConversation)
 */
@Injectable()
export class ChatValidator {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(PrivateConversation)
    private readonly conversationRepository: Repository<PrivateConversation>,
  ) {}

  /**
   * Validates that a chat message exists by message ID
   * @param messageId - The message ID to validate
   * @returns The found chat message
   * @throws NotFoundException if message not found
   */
  async validateChatMessageExists(messageId: string): Promise<ChatMessage> {
    const message = await this.chatMessageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Chat message not found');
    }

    return message;
  }

  /**
   * Validates that a private conversation exists by conversation ID
   * @param conversationId - The conversation ID to validate
   * @returns The found conversation
   * @throws NotFoundException if conversation not found
   */
  async validateConversationExists(conversationId: string): Promise<PrivateConversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }
}
