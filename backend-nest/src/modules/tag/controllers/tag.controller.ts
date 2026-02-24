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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ENDPOINT } from '@nest/shared';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PublicEndpoint } from 'src/common/decorators';
import { FeedsResDto } from 'src/modules/blog/dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { TagService } from '../services/tag.service';
import {
  CreateTagRes,
  GetUserTagsRes,
  AddUserTagRes,
  RemoveUserTagRes,
  AddBlogTagRes,
  RemoveBlogTagRes,
  GetBlogTagsRes,
  AddSpaceTagRes,
  RemoveSpaceTagRes,
  GetSpaceTagsRes,
  CreateTagReq,
  AddBlogTagReq,
  AddSpaceTagReq,
  AddUserTagReq,
} from '../dto';

@ApiTags('Tags')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class TagController {
  constructor(private tagService: TagService) {}

  @Post(ENDPOINT.CREATE_TAG)
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 200, description: 'Tag created successfully', type: CreateTagRes })
  async createTag(@Body() req: CreateTagReq): Promise<CreateTagRes> {
    return await this.tagService.createTag(req);
  }

  @Get(ENDPOINT.GET_USER_TAGS)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully', type: GetUserTagsRes })
  async getUserTags(@GetUser() user: User): Promise<GetUserTagsRes> {
    return await this.tagService.getUserTags(user.id);
  }

  @Post(ENDPOINT.ADD_USER_TAG)
  @HttpCode(200)
  @ApiOperation({ summary: 'Add tag to user' })
  @ApiResponse({ status: 200, description: 'Tag added successfully', type: AddUserTagRes })
  async addUserTag(@GetUser() user: User, @Body() req: AddUserTagReq): Promise<AddUserTagRes> {
    return await this.tagService.addUserTag(user.id, req);
  }

  @Delete(ENDPOINT.REMOVE_USER_TAG)
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove tag from user' })
  @ApiResponse({ status: 200, description: 'Tag removed successfully', type: RemoveUserTagRes })
  async removeUserTag(
    @GetUser() user: User,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<RemoveUserTagRes> {
    return await this.tagService.removeUserTag(user.id, tagId);
  }

  @Post(ENDPOINT.ADD_BLOG_TAG)
  @HttpCode(200)
  @ApiOperation({ summary: 'Add tag to blog' })
  @ApiResponse({ status: 200, description: 'Tag added successfully', type: AddBlogTagRes })
  async addBlogTag(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() req: AddBlogTagReq,
  ): Promise<AddBlogTagRes> {
    return await this.tagService.addBlogTag(user.id, blogId, req);
  }

  @Delete(ENDPOINT.REMOVE_BLOG_TAG)
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove tag from blog' })
  @ApiResponse({ status: 200, description: 'Tag removed successfully', type: RemoveBlogTagRes })
  async removeBlogTag(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<RemoveBlogTagRes> {
    return await this.tagService.removeBlogTag(user.id, blogId, tagId);
  }

  @Get(ENDPOINT.GET_BLOG_TAGS)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get blog tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully', type: GetBlogTagsRes })
  async getBlogTags(@Param('blogId', ParseUUIDPipe) blogId: string): Promise<GetBlogTagsRes> {
    return await this.tagService.getBlogTags(blogId);
  }

  @Post(ENDPOINT.ADD_SPACE_TAG)
  @HttpCode(200)
  @ApiOperation({ summary: 'Add tag to space' })
  @ApiResponse({ status: 200, description: 'Tag added successfully', type: AddSpaceTagRes })
  async addSpaceTag(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Body() req: AddSpaceTagReq,
  ): Promise<AddSpaceTagRes> {
    return await this.tagService.addSpaceTag(user.id, spaceId, req);
  }

  @Delete(ENDPOINT.REMOVE_SPACE_TAG)
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove tag from space' })
  @ApiResponse({ status: 200, description: 'Tag removed successfully', type: RemoveSpaceTagRes })
  async removeSpaceTag(
    @GetUser() user: User,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ): Promise<RemoveSpaceTagRes> {
    return await this.tagService.removeSpaceTag(user.id, spaceId, tagId);
  }

  @Get(ENDPOINT.GET_SPACE_TAGS)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get space tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully', type: GetSpaceTagsRes })
  async getSpaceTags(@Param('spaceId', ParseUUIDPipe) spaceId: string): Promise<GetSpaceTagsRes> {
    return await this.tagService.getSpaceTags(spaceId);
  }

  @Get(ENDPOINT.GET_TAG_BLOGS)
  @PublicEndpoint()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get blogs by tag' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Blogs retrieved successfully', type: FeedsResDto })
  async getTagBlogs(
    @Param('tagId') tagId: string,
    @Query('page') page: number = 1,
  ): Promise<FeedsResDto> {
    return await this.tagService.getBlogsByTag(tagId, page);
  }
}
