// feeds.service.ts
import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog.repository';
import { IFeedsService } from './interfaces';
import { FeedsResDto } from '../dto/feeds/feeds-res.dto';
import { Blog } from '../entities';
import { PrivateConversationRepository } from 'src/modules/chat/repositories/private-conversation.repository';
import { LikeRepository } from 'src/modules/like/repositories/like.repository';
import { CommentRepository } from 'src/modules/comment/repositories/comment.repository';
import { In } from 'typeorm';

@Injectable()
export class FeedsService implements IFeedsService {
  private readonly pageSize = 10;

  private readonly rankedBlogIdsCache = new Map<string, { ids: string[]; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly privateConversationRepo: PrivateConversationRepository,
    private readonly likeRepo: LikeRepository,
    private readonly commentRepo: CommentRepository,
  ) {}

  async getRelativeFeeds(userId: string, page: number): Promise<FeedsResDto> {
    const cached = this.rankedBlogIdsCache.get(userId);
    const now = Date.now();

    let rankedIds: string[];
    if (cached && now - cached.timestamp < this.CACHE_TTL) {
      rankedIds = cached.ids;
    } else {
      rankedIds = await this.getRelativeBlogsIds(userId);
      this.rankedBlogIdsCache.set(userId, { ids: rankedIds, timestamp: now });
    }

    const offset = this.calculateOffset(page);
    const pageIds = rankedIds.slice(offset, offset + this.pageSize);

    if (pageIds.length === 0) {
      return { feeds: [], page };
    }

    // Fetch full blog entities for the page results
    const blogs = await this.blogRepository.find({
      where: { id: In(pageIds) },
      relations: ['user', 'space'],
    });

    // Maintain the order from rankedIds
    const sortedBlogs = pageIds
      .map((id) => blogs.find((b) => b.id === id))
      .filter((b): b is Blog => !!b);

    return { feeds: sortedBlogs, page };
  }

  // TODO: Space blogs shuold be included
  async getRelativeBlogsIds(userId: string): Promise<string[]> {
    const ProcessingFeedsCount = 200;
    const blogs: Pick<Blog, 'id' | 'userId' | 'timestamp'>[] =
      await this.blogRepository.getNetworkblogs(userId, ProcessingFeedsCount);

    const authorSet = new Set<string>();
    blogs.forEach((blog) => {
      authorSet.add(blog.userId);
    });
    const authorIds = Array.from(authorSet);

    const [authorScoresList, blogWeightsList, blogTimeDecayList] = await Promise.all([
      Promise.all(
        authorIds.map(async (id) => ({
          id,
          score: await this.calculateUserAffinityScore(userId, id),
        })),
      ),
      Promise.all(
        blogs.map(async (blog) => ({
          id: blog.id,
          weight: await this.calculateBlogWeight(blog.id),
        })),
      ),
      Promise.all(
        blogs.map(async (blog) => ({
          id: blog.id,
          decay: await this.calculateTimeDecay(blog.timestamp),
        })),
      ),
    ]);

    const authorScores = new Map(authorScoresList.map((item) => [item.id, item.score]));
    const blogWeights = new Map(blogWeightsList.map((item) => [item.id, item.weight]));
    const blogDecays = new Map(blogTimeDecayList.map((item) => [item.id, item.decay]));

    // Blog Rank = Affinity * Weight * TimeDecay
    const blogRank = new Map<string, number>();
    for (const blog of blogs) {
      const rank =
        (authorScores.get(blog.userId) || 1) *
        (blogWeights.get(blog.id) || 1) *
        (blogDecays.get(blog.id) || 1);
      blogRank.set(blog.id, rank);
    }

    // Sort blogs by rank
    return blogs
      .sort((a, b) => (blogRank.get(b.id) || 0) - (blogRank.get(a.id) || 0))
      .map((blog) => blog.id);
  }

  private async calculateTimeDecay(timestamp: number): Promise<number> {
    const currentTime = Date.now();
    const timeDiff = currentTime - timestamp;
    const timeDecay = 1 / (1 + timeDiff);
    return timeDecay;
  }

  private async calculateBlogWeight(blogId: string): Promise<number> {
    const commentsCount = await this.blogRepository.getCommentsCount(blogId);
    const likesCount = await this.blogRepository.getLikesCount(blogId);
    const weight = commentsCount * 6 + likesCount * 2;
    return weight;
  }

  private async calculateUserAffinityScore(userId: string, authorId: string): Promise<number> {
    const privateMsgsCount = await this.privateConversationRepo.getConversationMsgsCount(
      userId,
      authorId,
    );
    const likesCount = await this.likeRepo.getFollowingLikesCount(userId, authorId);
    const commentsCount = await this.commentRepo.getFollowingCommentsCount(userId, authorId);

    const score = commentsCount * 5 + likesCount * 2 + privateMsgsCount * 10;
    return score;
  }

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
