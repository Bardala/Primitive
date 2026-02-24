import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards';
import { FeedQueryReqDto } from '../dto/feeds/feed-query-req.dto';
import { FeedsService } from '../services/feeds.service';
import { GetUser, PublicEndpoint } from 'src/common/decorators';
import { User } from 'src/modules/user/entities';
import { FeedsResDto } from '../dto';

@ApiTags('feeds')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get('personal')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized feeds for authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns personalized feeds' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPersonalFeeds(
    @GetUser() user: User,
    @Query() feedRequest: FeedQueryReqDto,
  ): Promise<FeedsResDto> {
    return await this.feedsService.getPersonalFeeds(user.id, feedRequest.page);
  }

  @Get('relative')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get relative feeds based on affinity scores' })
  @ApiResponse({ status: 200, description: 'Returns relative feeds' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRelativeFeeds(
    @GetUser() user: User,
    @Query() feedRequest: FeedQueryReqDto,
  ): Promise<FeedsResDto> {
    return await this.feedsService.getRelativeFeeds(user.id, feedRequest.page);
  }

  @Get('smart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get smart (algorithmically sorted) feeds for authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns smart feeds' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSmartFeeds(@GetUser() user: User, @Query() feedRequest: FeedQueryReqDto) {
    return await this.feedsService.getSmartFeeds(user.id, feedRequest.page);
  }

  @Get('public')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get public feeds (no authentication required)' })
  @ApiResponse({ status: 200, description: 'Returns public feeds' })
  async getPublicFeeds(@Query() feedRequest: FeedQueryReqDto) {
    return await this.feedsService.getPublicFeeds(feedRequest.page);
  }

  @Get('public/smart')
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get smart public feeds (algorithmically sorted)' })
  @ApiResponse({ status: 200, description: 'Returns smart public feeds' })
  async getSmartPublicFeeds(@Query() feedRequest: FeedQueryReqDto) {
    return await this.feedsService.getSmartPublicFeeds(feedRequest.page);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feeds for a specific user (admin/moderation)' })
  @ApiResponse({ status: 200, description: 'Returns user feeds' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserFeeds(@Param('userId') userId: string, @Query() feedRequest: FeedQueryReqDto) {
    // Add authorization check here if needed
    return await this.feedsService.getPersonalFeeds(userId, feedRequest.page);
  }
}
