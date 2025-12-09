import {
  Controller,
  Post,
  Get,
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
import { LikePostReq, LikePostRes } from '../dto/like-post.dto';
import { UnLikePostReq, UnLikePostRes } from '../dto/unlike-post.dto';
import { GetPostLikesReq, GetPostLikesRes } from '../dto/get-post-likes.dto';
import { LikeService } from '../services/like.service';

@ApiTags('Likes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post(ENDPOINT.LIKE_POST)
  @HttpCode(200)
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 200, description: 'Post liked successfully', type: LikePostRes })
  async likePost(
    @GetUser() user: User,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() _req: LikePostReq,
  ): Promise<LikePostRes> {
    return await this.likeService.likePost(user.id, postId);
  }

  @Delete(ENDPOINT.UNLIKE_POST)
  @HttpCode(200)
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 200, description: 'Post unliked successfully', type: UnLikePostRes })
  async unlikePost(
    @GetUser() user: User,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() _req: UnLikePostReq,
  ): Promise<UnLikePostRes> {
    return await this.likeService.unlikePost(user.id, postId);
  }

  @Get(ENDPOINT.GET_POST_LIKES)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get likes for a post' })
  @ApiResponse({ status: 200, description: 'Likes retrieved successfully', type: GetPostLikesRes })
  async getPostLikes(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() _req: GetPostLikesReq,
  ): Promise<GetPostLikesRes> {
    return await this.likeService.getPostLikes(postId);
  }
}
