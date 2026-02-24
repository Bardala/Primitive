import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { BlogSeries } from '../entities/blog-series.entity';
import { BlogSeriesLink } from '../entities/blog-series-links.entity';
import { Blog } from '../entities/blog.entity';
import { PageSize } from '@nest/shared';
import { FeedsResDto } from '../dto';
import {
  CreateSeriesReq,
  UpdateSeriesReq,
  AddBlogToSeriesReq,
  GetSeriesRes,
  ListSeriesRes,
} from '../dto/blog-series.dto';

@Injectable()
export class BlogSeriesService {
  constructor(
    @InjectRepository(BlogSeries)
    private seriesRepository: Repository<BlogSeries>,
    @InjectRepository(BlogSeriesLink)
    private seriesLinkRepository: Repository<BlogSeriesLink>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private dataSource: DataSource,
  ) {}

  async createSeries(userId: string, req: CreateSeriesReq): Promise<GetSeriesRes> {
    const series = new BlogSeries();
    series.id = randomUUID();
    series.name = req.name;
    series.description = req.description || '';
    series.createdBy = userId;
    series.createdAt = new Date();

    await this.seriesRepository.save(series);

    return this.mapToRes(series, []);
  }

  async updateSeries(
    userId: string,
    seriesId: string,
    req: UpdateSeriesReq,
  ): Promise<GetSeriesRes> {
    const series = await this.seriesRepository.findOne({ where: { id: seriesId } });

    if (!series) {
      throw new NotFoundException('Series not found');
    }

    if (series.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own series');
    }

    if (req.name) series.name = req.name;
    if (req.description !== undefined) series.description = req.description;

    await this.seriesRepository.save(series);

    return this.getSeries(seriesId);
  }

  async getSeries(seriesId: string): Promise<GetSeriesRes> {
    const series = await this.seriesRepository.findOne({
      where: { id: seriesId },
      relations: ['creator'],
    });

    if (!series) {
      throw new NotFoundException('Series not found');
    }

    const links = await this.seriesLinkRepository.find({
      where: { seriesId },
      relations: ['blog'],
      order: { position: 'ASC' },
    });

    return this.mapToRes(series, links);
  }

  async addBlogToSeries(
    userId: string,
    seriesId: string,
    req: AddBlogToSeriesReq,
  ): Promise<GetSeriesRes> {
    const series = await this.seriesRepository.findOne({ where: { id: seriesId } });

    if (!series) {
      throw new NotFoundException('Series not found');
    }

    if (series.createdBy !== userId) {
      throw new ForbiddenException('You can only modify your own series');
    }

    const blog = await this.blogRepository.findOne({ where: { id: req.blogId } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if blog is already in series
    const existingLink = await this.seriesLinkRepository.findOne({
      where: { seriesId, blogId: req.blogId },
    });

    if (existingLink) {
      throw new BadRequestException('Blog is already in this series');
    }

    // Transaction to handle reordering if needed
    await this.dataSource.transaction(async (manager) => {
      // Shift existing items if inserting in middle
      const existingAtPos = await manager.findOne(BlogSeriesLink, {
        where: { seriesId, position: req.position },
      });

      if (existingAtPos) {
        await manager
          .createQueryBuilder()
          .update(BlogSeriesLink)
          .set({ position: () => 'position + 1' })
          .where('seriesId = :seriesId', { seriesId })
          .andWhere('position >= :position', { position: req.position })
          .execute();
      }

      const link = new BlogSeriesLink();
      link.seriesId = seriesId;
      link.blogId = req.blogId;
      link.position = req.position;

      await manager.save(BlogSeriesLink, link);
    });

    return this.getSeries(seriesId);
  }

  async removeBlogFromSeries(
    userId: string,
    seriesId: string,
    blogId: string,
  ): Promise<GetSeriesRes> {
    const series = await this.seriesRepository.findOne({ where: { id: seriesId } });

    if (!series) {
      throw new NotFoundException('Series not found');
    }

    if (series.createdBy !== userId) {
      throw new ForbiddenException('You can only modify your own series');
    }

    const link = await this.seriesLinkRepository.findOne({ where: { seriesId, blogId } });

    if (!link) {
      throw new NotFoundException('Blog not found in series');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.remove(BlogSeriesLink, link);

      // Close gap
      await manager
        .createQueryBuilder()
        .update(BlogSeriesLink)
        .set({ position: () => 'position - 1' })
        .where('seriesId = :seriesId', { seriesId })
        .andWhere('position > :position', { position: link.position })
        .execute();
    });

    return this.getSeries(seriesId);
  }

  async deleteSeries(userId: string, seriesId: string): Promise<void> {
    const series = await this.seriesRepository.findOne({ where: { id: seriesId } });

    if (!series) {
      throw new NotFoundException('Series not found');
    }

    if (series.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own series');
    }

    await this.seriesRepository.remove(series);
  }

  async listUserSeries(userId: string): Promise<ListSeriesRes> {
    const seriesList = await this.seriesRepository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' },
    });

    return { series: seriesList };
  }

  async getBlogsBySeries(seriesId: string, page: number): Promise<FeedsResDto> {
    const links = await this.seriesLinkRepository.find({
      where: { seriesId },
      relations: ['blog'],
      order: { position: 'ASC' },
      skip: (page - 1) * PageSize,
      take: PageSize,
    });

    return new FeedsResDto(
      links.map((link) => link.blog),
      page,
    );
  }

  private mapToRes(series: BlogSeries, links: BlogSeriesLink[]): GetSeriesRes {
    return {
      series,
      blogs: links.map((link) => ({
        id: link.blog.id,
        title: link.blog.title,
        position: link.position,
        author: link.blog.author,
      })),
    };
  }
}
