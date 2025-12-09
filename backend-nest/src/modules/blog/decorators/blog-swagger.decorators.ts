import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateBlogRes } from '../dto/create-blog.dto';
import { UpdateBlogRes } from '../dto/update-blog.dto';
import { BlogRes } from '../dto/get-blog.dto';
import { DeleteBlogRes } from '../dto/delete-blog.dto';
import { BlogCommentsRes } from '../dto/blog-comments.dto';
import { BlogLikesRes } from '../dto/blog-likes.dto';
import { BlogLikesListRes } from '../dto/blog-likes-list.dto';
import { CreateLikeRes } from '../dto/create-like.dto';
import { RemoveLikeRes } from '../dto/remove-like.dto';
import { NumOfCommentsRes } from '../dto/num-of-comments.dto';

export function CreateBlogSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new blog' }),
    ApiResponse({ status: 200, description: 'Blog created successfully', type: CreateBlogRes }),
  );
}

export function UpdateBlogSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({ status: 200, description: 'Blog updated successfully', type: UpdateBlogRes }),
  );
}

export function GetBlogSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a blog by ID' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({ status: 200, description: 'Blog retrieved successfully', type: BlogRes }),
  );
}

export function DeleteBlogSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({ status: 200, description: 'Blog deleted successfully', type: DeleteBlogRes }),
  );
}

export function GetBlogCommentsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get comments for a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({
      status: 200,
      description: 'Comments retrieved successfully',
      type: BlogCommentsRes,
    }),
  );
}

export function LikeBlogSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Like a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({ status: 200, description: 'Blog liked successfully', type: CreateLikeRes }),
  );
}

export function UnlikeBlogSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Unlike a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({ status: 200, description: 'Blog unliked successfully', type: RemoveLikeRes }),
  );
}

export function GetBlogLikesSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get likes count for a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({ status: 200, description: 'Likes retrieved successfully', type: BlogLikesRes }),
  );
}

export function GetBlogLikesListSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list of users who liked a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({
      status: 200,
      description: 'Likes list retrieved successfully',
      type: BlogLikesListRes,
    }),
  );
}

export function GetNumOfCommentsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get number of comments for a blog' }),
    ApiParam({ name: 'blogId', description: 'Blog ID' }),
    ApiResponse({
      status: 200,
      description: 'Comments count retrieved successfully',
      type: NumOfCommentsRes,
    }),
  );
}
