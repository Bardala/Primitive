import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ENDPOINT } from '@nest/shared';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { ChatService } from '../services/chat.service';
import { CreateMsgReq, CreateMsgRes } from '../dto/create-message.dto';
import { DeleteMsgRes } from '../dto/delete-message.dto';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post(ENDPOINT.CREATE_MESSAGE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new message in space chat' })
  @ApiResponse({ status: 200, description: 'Message created successfully', type: CreateMsgRes })
  async createMessage(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Body() req: CreateMsgReq,
  ): Promise<CreateMsgRes> {
    return this.chatService.createMessage(user.id, spaceId, req);
  }

  @Delete(ENDPOINT.DELETE_MESSAGE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully', type: DeleteMsgRes })
  async deleteMessage(
    @GetUser() user: User,
    @Param('msgId', ParseUUIDPipe) msgId: string,
  ): Promise<DeleteMsgRes> {
    return this.chatService.deleteMessage(user.id, msgId);
  }

  @Get(ENDPOINT.Get_SPACE_CHAT)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get space chat messages' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getSpaceChat(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<{ messages: any[] }> {
    const messages = await this.chatService.getSpaceChat(spaceId, user.id);
    return { messages };
  }

  @Post(ENDPOINT.MARK_SPACE_CHAT_AS_READ)
  @HttpCode(200)
  @ApiOperation({ summary: 'Mark all messages in a space as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  async markAsRead(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<{ success: boolean }> {
    await this.chatService.markAsRead(user.id, spaceId);
    return { success: true };
  }
}
