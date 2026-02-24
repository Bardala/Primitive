import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ENDPOINT } from '@nest/shared';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { CommentService } from '../services/comment.service';
import { CreateCommentReq, CreateCommentRes } from '../dto/create-comment.dto';
import { UpdateCommentReq, UpdateCommentRes } from '../dto/update-comment.dto';
import { DeleteCommentReq, DeleteCommentRes } from '../dto/delete-comment.dto';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(ENDPOINT.CREATE_COMMENT)
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({ status: 200, description: 'Comment created successfully', type: CreateCommentRes })
  async createComment(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() req: CreateCommentReq,
  ): Promise<CreateCommentRes> {
    return await this.commentService.createComment(user.id, blogId, req);
  }

  @Put(ENDPOINT.UPDATE_COMMENT)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully', type: UpdateCommentRes })
  async updateComment(
    @GetUser() user: User,
    @Body() req: UpdateCommentReq,
  ): Promise<UpdateCommentRes> {
    return await this.commentService.updateComment(user.id, req);
  }

  @Delete(ENDPOINT.DELETE_COMMENT)
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully', type: DeleteCommentRes })
  async deleteComment(
    @GetUser() user: User,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() _req: DeleteCommentReq,
  ): Promise<DeleteCommentRes> {
    return await this.commentService.deleteComment(user.id, commentId);
  }
}
