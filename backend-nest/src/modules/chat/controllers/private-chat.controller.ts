import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
  UseGuards,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { PrivateChatService } from '../services';
import {
  ENDPOINT,
  type PrivateConversation as IPrivateConversation,
  type PrivateMessage as IPrivateMessage,
  type GetConversationsRes,
} from '@nest/shared';
import { GetUser } from 'src/common/decorators';
import { User } from 'src/modules/user/entities';
import { CreatePrivateConvoReq } from '../dto';
import { JwtAuthGuard } from 'src/common/guards';
import { ChatGateway } from '../chat.gateway';

@UseGuards(JwtAuthGuard)
@Controller()
export class PrivateChatController {
  constructor(
    private readonly privateChatService: PrivateChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post(ENDPOINT.CREATE_PRIVATE_CONVERSATION)
  async createConversation(
    @GetUser() user: User,
    @Body() req: CreatePrivateConvoReq,
  ): Promise<IPrivateConversation> {
    return this.privateChatService.createConversation(user.id, req.otherUserId);
  }

  @Get(ENDPOINT.GET_PRIVATE_MESSAGES)
  async getMessages(
    @GetUser() user: User,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<IPrivateMessage[]> {
    return this.privateChatService.getMessages(conversationId, user.id, limit, offset);
  }

  @Get(ENDPOINT.GET_PRIVATE_CONVERSATIONS)
  async getConversations(@GetUser() user: User): Promise<GetConversationsRes> {
    return this.privateChatService.getConversations(user.id);
  }

  @Post(ENDPOINT.MARK_PRIVATE_CHAT_AS_READ)
  @HttpCode(200)
  async markAsRead(
    @GetUser() user: User,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Body() body?: { lastReadId?: string },
  ): Promise<{ success: boolean }> {
    await this.privateChatService.markAsRead(user.id, conversationId, body?.lastReadId);

    // Broadcast read receipt via WebSocket
    this.chatGateway.sendReadReceipt(conversationId, user.id);

    return { success: true };
  }

  @Post(ENDPOINT.MUTE_PRIVATE_CHAT as any)
  @HttpCode(200)
  async toggleMute(
    @GetUser() user: User,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Body() body: { isMuted?: boolean },
  ): Promise<{ success: boolean }> {
    await this.privateChatService.toggleMute(user.id, conversationId, body.isMuted);
    return { success: true };
  }
}
