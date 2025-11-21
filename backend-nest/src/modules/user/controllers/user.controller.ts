import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { GetUser } from '../../../common/decorators/user.decorator';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationQuery } from 'src/modules/shared/dto/PaginationQuery';
import { UpdatePasswordReq } from '../dto/update-password.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users list' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all users',
    schema: {
      example: {
        usersList: [
          { id: '123', username: 'JohnDoe' },
          { id: '456', username: 'jane_smith' },
        ],
      },
    },
  })
  async getUsersList() {
    return { usersList: await this.userService.findAll() };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user data',
  })
  async getCurrentUser(@GetUser() user: User) {
    const userData = await this.userService.findById(user.id);
    return { user: userData };
  }

  @Get(':id/card')
  @ApiOperation({ summary: 'Get user card information' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns user card data',
    schema: {
      example: {
        userCard: {
          id: '123',
          username: 'JohnDoe',
          avatarUrl: 'https://example.com/avatar.jpg',
          bio: 'Software developer',
          isFollowing: true,
          followerCount: 42,
          followingCount: 15,
        },
      },
    },
  })
  async getUserCard(@GetUser() user: User, @Param('id', ParseUUIDPipe) targetUserId: string) {
    return { userCard: await this.userService.getUserCard(user.id, targetUserId) };
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get user followers' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of followers',
    schema: {
      example: {
        followers: [
          { id: '456', username: 'follower1' },
          { id: '789', username: 'follower2' },
        ],
      },
    },
  })
  async getFollowers(@Param('id', ParseUUIDPipe) userId: string) {
    return { followers: await this.userService.getFollowers(userId) };
  }

  @Put(':id/follow')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({ name: 'id', description: 'User ID to follow' })
  @ApiResponse({
    status: 200,
    description: 'Successfully followed user',
    schema: {
      example: {
        message: 'Successfully followed user',
      },
    },
  })
  async createFollow(@GetUser() user: User, @Param('id', ParseUUIDPipe) targetUserId: string) {
    await this.userService.createFollow(user.id, targetUserId);
    return { message: 'Successfully followed user' };
  }

  @Put(':id/unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({ name: 'id', description: 'User ID to unfollow' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unfollowed user',
    schema: {
      example: {
        message: 'Successfully unfollowed user',
      },
    },
  })
  async deleteFollow(@GetUser() user: User, @Param('id', ParseUUIDPipe) targetUserId: string) {
    await this.userService.deleteFollow(user.id, targetUserId);
    return { message: 'Successfully unfollowed user' };
  }

  @Get(':id/blogs')
  @ApiOperation({ summary: 'Get user blogs with pagination' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns user blogs with pagination',
    schema: {
      example: {
        blogs: [
          {
            id: 'blog123',
            title: 'My First Blog',
            content: 'Blog content...',
            author: 'JohnDoe',
            timestamp: 1633046400000,
          },
        ],
        page: 1,
      },
    },
  })
  async getUserBlogs(@Param('id', ParseUUIDPipe) userId: string, @Query() query: PaginationQuery) {
    return await this.userService.getUserBlogs(userId, query.page);
  }

  @Get(':id/spaces')
  @ApiOperation({ summary: 'Get user spaces' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns user spaces',
    schema: {
      example: {
        spaces: [
          {
            id: 'space123',
            name: 'Tech Discussions',
            description: 'Space for tech enthusiasts',
            status: 'active',
          },
        ],
      },
    },
  })
  async getUserSpaces(@Param('id', ParseUUIDPipe) userId: string) {
    return { spaces: await this.userService.getUserSpaces(userId) };
  }

  @Put('password')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    schema: {
      example: {
        message: 'Password updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async updatePassword(@GetUser() user: User, @Body() updatePasswordDto: UpdatePasswordReq) {
    await this.userService.updatePassword(user.id, updatePasswordDto);
    return { message: 'Password updated successfully' };
  }
}
