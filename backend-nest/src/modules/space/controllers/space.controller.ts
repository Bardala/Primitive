import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ENDPOINT } from '@nest/shared';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { SpaceService } from '../services/space.service';
import {
  CreateSpaceRes,
  DefaultSpaceRes,
  SpaceRes,
  UpdateSpaceRes,
  DeleteSpaceRes,
  JoinSpaceRes,
  LeaveSpaceRes,
  AddMemberRes,
  MembersRes,
  DeleteMemRes,
  UnReadMsgsNumRes,
  SpaceBlogsRes,
  CreateSpaceReq,
  UpdateSpaceReq,
  AddMemberReq,
} from '../dto';
import { PublicEndpoint } from 'src/common/decorators';

@ApiTags('Spaces')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  @Post(ENDPOINT.CREATE_SPACE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new space' })
  @ApiResponse({ status: 200, description: 'Space created successfully', type: CreateSpaceRes })
  async createSpace(@GetUser() user: User, @Body() req: CreateSpaceReq): Promise<CreateSpaceRes> {
    return await this.spaceService.createSpace(user.id, req);
  }

  @Get(ENDPOINT.GET_DEFAULT_SPACE)
  @HttpCode(200)
  @PublicEndpoint()
  @ApiOperation({ summary: 'Get default space' })
  @ApiResponse({ status: 200, description: 'Default space retrieved', type: DefaultSpaceRes })
  async getDefaultSpace(): Promise<DefaultSpaceRes> {
    return await this.spaceService.getDefaultSpace();
  }

  @Get(ENDPOINT.GET_SPACE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get space by ID' })
  @ApiResponse({ status: 200, description: 'Space retrieved successfully', type: SpaceRes })
  async getSpace(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<SpaceRes> {
    return await this.spaceService.getSpace(user?.id, spaceId);
  }

  @Put(ENDPOINT.UPDATE_SPACE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a space' })
  @ApiResponse({ status: 200, description: 'Space updated successfully', type: UpdateSpaceRes })
  async updateSpace(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Body() req: UpdateSpaceReq,
  ): Promise<UpdateSpaceRes> {
    return await this.spaceService.updateSpace(user.id, spaceId, req);
  }

  @Delete(ENDPOINT.DELETE_SPACE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a space' })
  @ApiResponse({ status: 200, description: 'Space deleted successfully', type: DeleteSpaceRes })
  async deleteSpace(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<DeleteSpaceRes> {
    return await this.spaceService.deleteSpace(user.id, spaceId);
  }

  @Post(ENDPOINT.JOIN_SPACE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Join a space' })
  @ApiResponse({ status: 200, description: 'Joined space successfully', type: JoinSpaceRes })
  async joinSpace(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<JoinSpaceRes> {
    return await this.spaceService.joinSpace(user.id, spaceId);
  }

  @Post(ENDPOINT.LEAVE_SPACE)
  @HttpCode(200)
  @ApiOperation({ summary: 'Leave a space' })
  @ApiResponse({ status: 200, description: 'Left space successfully', type: LeaveSpaceRes })
  async leaveSpace(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<LeaveSpaceRes> {
    return await this.spaceService.leaveSpace(user.id, spaceId);
  }

  @Post(ENDPOINT.ADD_MEMBER)
  @HttpCode(200)
  @ApiOperation({ summary: 'Add member to space' })
  @ApiResponse({ status: 200, description: 'Member added successfully', type: AddMemberRes })
  async addMember(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Body() req: AddMemberReq,
  ): Promise<AddMemberRes> {
    return await this.spaceService.addMember(user.id, spaceId, req);
  }

  @Get(ENDPOINT.GET_SPACE_MEMBERS)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get space members' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully', type: MembersRes })
  async getMembers(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<MembersRes> {
    return await this.spaceService.getMembers(user.id, spaceId);
  }

  @Delete(ENDPOINT.DELETE_MEMBER)
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove member from space' })
  @ApiResponse({ status: 200, description: 'Member removed successfully', type: DeleteMemRes })
  async deleteMember(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ): Promise<DeleteMemRes> {
    return await this.spaceService.deleteMember(user.id, spaceId, memberId);
  }

  @Get(ENDPOINT.GET_UNREAD_MSGS_NUM)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get unread messages count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved', type: UnReadMsgsNumRes })
  async getUnreadCount(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ): Promise<UnReadMsgsNumRes> {
    return await this.spaceService.getUnreadCount(user.id, spaceId);
  }

  @Get(ENDPOINT.GET_SPACE_BLOGS)
  @PublicEndpoint()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get space blogs' })
  @ApiResponse({ status: 200, description: 'Blogs retrieved successfully', type: SpaceBlogsRes })
  async getBlogs(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Query('page') page: string,
  ): Promise<SpaceBlogsRes> {
    return await this.spaceService.getBlogs(user?.id, spaceId, parseInt(page) || 1);
  }

  @Get(ENDPOINT.GET_DEFAULT_SPACE_BLOGS)
  @PublicEndpoint()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get space blogs' })
  @ApiResponse({ status: 200, description: 'Blogs retrieved successfully', type: SpaceBlogsRes })
  async getDefaultSpaceBlogs(
    @GetUser() user: User,
    @Query('page') page: string,
  ): Promise<SpaceBlogsRes> {
    return await this.spaceService.getDefaultSpaceBlogs(user?.id, parseInt(page) || 1);
  }
}
