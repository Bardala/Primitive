import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ENDPOINT } from '@nest/shared';

import { UserService } from '../services/user.service';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationQuery } from 'src/modules/shared/dto/PaginationQuery';
import { UpdatePasswordReq } from '../dto/update-password.dto';
import {
  CreateFollowerSwagger,
  DeleteFollowerSwagger,
  GetCurrentUserSwagger,
  GetFollowersSwagger,
  GetUserBlogsSwagger,
  GetUserCardSwagger,
  GetUsersListSwagger,
  GetUserSpacesSwagger,
  UpdatePasswordSwagger,
} from '../decorators';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get(ENDPOINT.GET_USERS_LIST)
  @HttpCode(200)
  @GetUsersListSwagger()
  async getUsersList() {
    return { usersList: await this.userService.findAll() };
  }

  @Get('me')
  @HttpCode(200)
  @GetCurrentUserSwagger()
  async getCurrentUser(@GetUser() user: User) {
    const userData = await this.userService.findById(user.id);
    return { user: userData };
  }

  @Get(ENDPOINT.GET_USER_CARD)
  @HttpCode(200)
  @GetUserCardSwagger()
  async getUserCard(@GetUser() user: User, @Param('id', ParseUUIDPipe) targetUserId: string) {
    return await this.userService.getUserCard(user.id, targetUserId);
  }

  @Get(ENDPOINT.GET_FOLLOWERS)
  @HttpCode(200)
  @GetFollowersSwagger()
  async getFollowers(@Param('id', ParseUUIDPipe) userId: string) {
    return { followers: await this.userService.getFollowers(userId) };
  }

  @Get(ENDPOINT.GET_FOLLOWING)
  @HttpCode(200)
  async getFollowing(@Param('id', ParseUUIDPipe) userId: string) {
    return { followers: await this.userService.getFollowing(userId) };
  }

  @Post(ENDPOINT.FOLLOW_USER)
  @HttpCode(200)
  @CreateFollowerSwagger()
  async createFollow(@GetUser() user: User, @Param('id', ParseUUIDPipe) targetUserId: string) {
    await this.userService.createFollow(user.id, targetUserId);
    return { message: 'Successfully followed user' };
  }

  @Delete(ENDPOINT.UNFOLLOW_USER)
  @HttpCode(200)
  @DeleteFollowerSwagger()
  async deleteFollow(@GetUser() user: User, @Param('id', ParseUUIDPipe) targetUserId: string) {
    await this.userService.deleteFollow(user.id, targetUserId);
    return { message: 'Successfully unfollowed user' };
  }

  @Get(ENDPOINT.GET_USER_BLOGS)
  @HttpCode(200)
  @GetUserBlogsSwagger()
  async getUserBlogs(@Param('id', ParseUUIDPipe) userId: string, @Query() query: PaginationQuery) {
    return await this.userService.getUserBlogs(userId, query.page);
  }

  @Get(ENDPOINT.GET_USER_SPACES)
  @HttpCode(200)
  @GetUserSpacesSwagger()
  async getUserSpaces(@Param('id', ParseUUIDPipe) userId: string) {
    return { spaces: await this.userService.getUserSpaces(userId) };
  }

  @Put(ENDPOINT.UPDATE_USER_PASSWORD)
  @HttpCode(200)
  @UpdatePasswordSwagger()
  async updatePassword(@GetUser() user: User, @Body() updatePasswordDto: UpdatePasswordReq) {
    await this.userService.updatePassword(user.id, updatePasswordDto);
    return { message: 'Password updated successfully' };
  }
}
