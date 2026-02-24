import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Patch,
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
import { FeedsResDto } from '../dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { BlogSeriesService } from '../services/blog-series.service';
import {
  CreateSeriesReq,
  UpdateSeriesReq,
  AddBlogToSeriesReq,
  GetSeriesRes,
  ListSeriesRes,
} from '../dto/blog-series.dto';

@ApiTags('Blog Series')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class BlogSeriesController {
  constructor(private seriesService: BlogSeriesService) {}

  @Post(ENDPOINT.CREATE_SERIES)
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new blog series' })
  @ApiResponse({ status: 200, description: 'Series created', type: GetSeriesRes })
  async createSeries(@GetUser() user: User, @Body() req: CreateSeriesReq): Promise<GetSeriesRes> {
    return await this.seriesService.createSeries(user.id, req);
  }

  @Get(ENDPOINT.GET_USER_SERIES)
  @HttpCode(200)
  @ApiOperation({ summary: 'List user series' })
  @ApiResponse({ status: 200, description: 'User series list', type: ListSeriesRes })
  async listUserSeries(@GetUser() user: User): Promise<ListSeriesRes> {
    return await this.seriesService.listUserSeries(user.id);
  }

  @Get(ENDPOINT.GET_SERIES)
  @PublicEndpoint()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get blog series details' })
  @ApiResponse({ status: 200, description: 'Series details', type: GetSeriesRes })
  async getSeries(@Param('seriesId', ParseUUIDPipe) id: string): Promise<GetSeriesRes> {
    return await this.seriesService.getSeries(id);
  }

  @Get(ENDPOINT.GET_SERIES_BLOGS)
  @PublicEndpoint()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get blogs in series' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Blogs list', type: FeedsResDto })
  async getSeriesBlogs(
    @Param('seriesId', ParseUUIDPipe) id: string,
    @Query('page') page: number = 1,
  ): Promise<FeedsResDto> {
    return await this.seriesService.getBlogsBySeries(id, page);
  }

  @Put(ENDPOINT.UPDATE_SERIES)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update blog series' })
  @ApiResponse({ status: 200, description: 'Series updated', type: GetSeriesRes })
  async updateSeries(
    @GetUser() user: User,
    @Param('seriesId', ParseUUIDPipe) id: string,
    @Body() req: UpdateSeriesReq,
  ): Promise<GetSeriesRes> {
    return await this.seriesService.updateSeries(user.id, id, req);
  }

  @Patch(ENDPOINT.ADD_BLOG_TO_SERIES)
  @HttpCode(200)
  @ApiOperation({ summary: 'Add blog to series' })
  @ApiResponse({ status: 200, description: 'Blog added to series', type: GetSeriesRes })
  async addBlogToSeries(
    @GetUser() user: User,
    @Param('seriesId', ParseUUIDPipe) id: string,
    @Body() req: AddBlogToSeriesReq,
  ): Promise<GetSeriesRes> {
    return await this.seriesService.addBlogToSeries(user.id, id, req);
  }

  @Delete(ENDPOINT.REMOVE_BLOG_FROM_SERIES)
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove blog from series' })
  @ApiResponse({ status: 200, description: 'Blog removed from series', type: GetSeriesRes })
  async removeBlogFromSeries(
    @GetUser() user: User,
    @Param('seriesId', ParseUUIDPipe) id: string,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<GetSeriesRes> {
    return await this.seriesService.removeBlogFromSeries(user.id, id, blogId);
  }

  @Delete(ENDPOINT.DELETE_SERIES)
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete blog series' })
  async deleteSeries(
    @GetUser() user: User,
    @Param('seriesId', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.seriesService.deleteSeries(user.id, id);
  }
}
