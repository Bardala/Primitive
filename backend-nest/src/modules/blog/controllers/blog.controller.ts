import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ENDPOINT } from '@nest/shared';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { BlogService } from '../services/blog.service';
import { CreateBlogReq, CreateBlogRes } from '../dto/create-blog.dto';
import { UpdateBlogReq, UpdateBlogRes } from '../dto/update-blog.dto';
import { BlogRes } from '../dto/get-blog.dto';
import { DeleteBlogRes } from '../dto/delete-blog.dto';
import { BlogCommentsRes } from '../dto/blog-comments.dto';
import { BlogLikesRes } from '../dto/blog-likes.dto';
import { BlogLikesListRes } from '../dto/blog-likes-list.dto';
import { CreateLikeRes } from '../dto/create-like.dto';
import { RemoveLikeRes } from '../dto/remove-like.dto';
import { NumOfCommentsRes } from '../dto/num-of-comments.dto';

import {
  CreateBlogSwagger,
  UpdateBlogSwagger,
  GetBlogSwagger,
  DeleteBlogSwagger,
  GetBlogCommentsSwagger,
  LikeBlogSwagger,
  UnlikeBlogSwagger,
  GetBlogLikesSwagger,
  GetBlogLikesListSwagger,
  GetNumOfCommentsSwagger,
} from '../decorators/blog-swagger.decorators';
import { PublicEndpoint } from 'src/common/decorators';

@ApiTags('Blogs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post(ENDPOINT.CREATE_BLOG)
  @HttpCode(200)
  @CreateBlogSwagger()
  async createBlog(@GetUser() user: User, @Body() req: CreateBlogReq): Promise<CreateBlogRes> {
    return this.blogService.createBlog(user.id, req);
  }

  @Put(ENDPOINT.UPDATE_BLOG)
  @HttpCode(200)
  @UpdateBlogSwagger()
  async updateBlog(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
    @Body() req: UpdateBlogReq,
  ): Promise<UpdateBlogRes> {
    return this.blogService.updateBlog(user.id, blogId, req);
  }

  @Get(ENDPOINT.GET_BLOG)
  @PublicEndpoint()
  @HttpCode(200)
  @GetBlogSwagger()
  async getBlog(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<BlogRes> {
    return this.blogService.getBlog(user?.id, blogId);
  }

  @Delete(ENDPOINT.DELETE_BLOG)
  @HttpCode(200)
  @DeleteBlogSwagger()
  async deleteBlog(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<DeleteBlogRes> {
    return this.blogService.deleteBlog(user.id, blogId);
  }

  @Get(ENDPOINT.GET_BLOG_COMMENTS)
  @PublicEndpoint()
  @HttpCode(200)
  @GetBlogCommentsSwagger()
  async getBlogComments(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<BlogCommentsRes> {
    return this.blogService.getBlogComments(user?.id, blogId);
  }

  @Post(ENDPOINT.LIKE_BLOG)
  @HttpCode(200)
  @LikeBlogSwagger()
  async likeBlog(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<CreateLikeRes> {
    return this.blogService.likeBlog(user.id, blogId);
  }

  @Delete(ENDPOINT.UNLIKE_BLOG)
  @HttpCode(200)
  @UnlikeBlogSwagger()
  async unlikeBlog(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<RemoveLikeRes> {
    return this.blogService.unlikeBlog(user.id, blogId);
  }

  @Get(ENDPOINT.GET_BLOG_LIKES)
  @PublicEndpoint()
  @HttpCode(200)
  @GetBlogLikesSwagger()
  async getBlogLikes(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<BlogLikesRes> {
    return this.blogService.getBlogLikes(user?.id, blogId);
  }

  @Get(ENDPOINT.GET_BLOG_LIKES_LIST)
  @HttpCode(200)
  @GetBlogLikesListSwagger()
  async getBlogLikesList(
    @GetUser() user: User,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<BlogLikesListRes> {
    return this.blogService.getBlogLikesList(user?.id, blogId);
  }

  @Get(ENDPOINT.NUM_OF_COMMENTS)
  @PublicEndpoint()
  @HttpCode(200)
  @GetNumOfCommentsSwagger()
  async getNumOfComments(
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<NumOfCommentsRes> {
    return this.blogService.getNumOfComments(blogId);
  }
}
