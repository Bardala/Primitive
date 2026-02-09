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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
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
@Controller('series')
export class BlogSeriesController {
  constructor(private seriesService: BlogSeriesService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new blog series' })
  @ApiResponse({ status: 200, description: 'Series created', type: GetSeriesRes })
  async createSeries(@GetUser() user: User, @Body() req: CreateSeriesReq): Promise<GetSeriesRes> {
    return await this.seriesService.createSeries(user.id, req);
  }

  @Get('user')
  @HttpCode(200)
  @ApiOperation({ summary: 'List user series' })
  @ApiResponse({ status: 200, description: 'User series list', type: ListSeriesRes })
  async listUserSeries(@GetUser() user: User): Promise<ListSeriesRes> {
    return await this.seriesService.listUserSeries(user.id);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get blog series details' })
  @ApiResponse({ status: 200, description: 'Series details', type: GetSeriesRes })
  async getSeries(@Param('id', ParseUUIDPipe) id: string): Promise<GetSeriesRes> {
    return await this.seriesService.getSeries(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update blog series' })
  @ApiResponse({ status: 200, description: 'Series updated', type: GetSeriesRes })
  async updateSeries(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() req: UpdateSeriesReq,
  ): Promise<GetSeriesRes> {
    return await this.seriesService.updateSeries(user.id, id, req);
  }

  @Patch(':id/blogs')
  @HttpCode(200)
  @ApiOperation({ summary: 'Add blog to series' })
  @ApiResponse({ status: 200, description: 'Blog added to series', type: GetSeriesRes })
  async addBlogToSeries(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() req: AddBlogToSeriesReq,
  ): Promise<GetSeriesRes> {
    return await this.seriesService.addBlogToSeries(user.id, id, req);
  }

  @Delete(':id/blogs/:blogId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove blog from series' })
  @ApiResponse({ status: 200, description: 'Blog removed from series', type: GetSeriesRes })
  async removeBlogFromSeries(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('blogId', ParseUUIDPipe) blogId: string,
  ): Promise<GetSeriesRes> {
    return await this.seriesService.removeBlogFromSeries(user.id, id, blogId);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete blog series' })
  async deleteSeries(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.seriesService.deleteSeries(user.id, id);
  }
}
