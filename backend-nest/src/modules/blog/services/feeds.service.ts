// feeds.service.ts
import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog.repository';
import { IFeedsService } from './interfaces';
import { FeedsResDto } from '../dto/feeds/feeds-res.dto';

@Injectable()
export class FeedsService implements IFeedsService {
  private readonly pageSize = 10;

  constructor(private readonly blogRepository: BlogRepository) {}

  private calculateOffset(page: number): number {
    return (page - 1) * this.pageSize;
  }

  /**
   * Get personalized feeds for authenticated users
   */
  async getPersonalFeeds(memberId: string, page: number): Promise<FeedsResDto> {
    const offset = this.calculateOffset(page);

    const feeds = await this.blogRepository.getFeeds(memberId, this.pageSize, offset);
    return { feeds, page };
  }

  /**
   * Get public feeds for non-authenticated users
   */
  async getPublicFeeds(page: number): Promise<FeedsResDto> {
    const offset = this.calculateOffset(page);
    const feeds = await this.blogRepository.getPublicFeeds(this.pageSize, offset);
    return { feeds, page };
  }

  /**
   * Get smart (algorithmically sorted) feeds for authenticated users
   */
  async getSmartFeeds(memberId: string, page: number): Promise<FeedsResDto> {
    const feeds = await this.blogRepository.getSmartFeeds(
      memberId,
      this.pageSize,
      this.calculateOffset(page),
    );

    return { feeds, page };
  }

  /**
   * Get smart (algorithmically sorted) public feeds
   */
  async getSmartPublicFeeds(page: number): Promise<FeedsResDto> {
    const feeds = await this.blogRepository.getSmartPublicFeeds(
      this.pageSize,
      this.calculateOffset(page),
    );
    return { feeds, page };
  }
}
