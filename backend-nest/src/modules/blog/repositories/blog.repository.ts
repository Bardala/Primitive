import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { FeedsDao } from '../dao/feeds.dao';
import { Follow } from 'src/modules/shared/entities';
import { Member } from 'src/modules/space/entities';

@Injectable()
export class BlogRepository extends Repository<Blog> implements FeedsDao {
  private readonly blogIconLength = 200; // Adjust as needed

  constructor(dataSource: DataSource) {
    super(Blog, dataSource.createEntityManager());
  }

  async getFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]> {
    const blogs: Blog[] = await this.createQueryBuilder('blogs')
      .select([
        'blogs.id As id',
        'blogs.title As title',
        'blogs.userId As userId',
        'blogs.spaceId As spaceId',
        'blogs.author As author',
        'blogs.timestamp As timestamp',
      ])
      .addSelect(`SUBSTRING(blogs.content, 1, ${this.blogIconLength})`, 'content')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('spaceId')
          .from(Member, 'm')
          .where('m.memberId = :memberId AND m.spaceId != :publicSpaceId')
          .getQuery();

        const subQuery2 = qb
          .subQuery()
          .select('followingId')
          .from(Follow, 'f')
          .where('f.followerId = :memberId')
          .getQuery();

        return (
          '(blogs.spaceId IN ' +
          subQuery +
          ') OR ' +
          '(blogs.userId IN ' +
          subQuery2 +
          ' AND blogs.spaceId = :publicSpaceId) OR ' +
          'blogs.userId = :memberId'
        );
      })
      .setParameters({
        memberId,
        publicSpaceId: '1',
      })
      .orderBy('blogs.timestamp', 'DESC')
      .take(pageSize)
      .skip(offset)
      .getRawMany();

    return blogs;
  }

  async getPublicFeeds(pageSize: number, offset: number): Promise<Blog[]> {
    const blogs: Blog[] = await this.createQueryBuilder('blogs')
      .select([
        'blogs.id AS id',
        'blogs.title AS title',
        'blogs.userId AS userId',
        'blogs.spaceId AS spaceId',
        'blogs.author AS author',
        'blogs.timestamp AS timestamp',
      ])
      .addSelect(`SUBSTRING(blogs.content, 1, ${this.blogIconLength})`, 'content')
      .innerJoin('blogs.space', 'space')
      .where('space.status = :status', { status: 'public' })
      .orderBy('blogs.timestamp', 'DESC')
      .take(pageSize)
      .skip(offset)
      .getRawMany();

    return blogs;
  }

  async getSmartFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]> {
    const currentTime = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

    const rawResults = await this.createQueryBuilder('b')
      .select([
        'b.id as id',
        'b.title as title',
        'b.userId as userId',
        'b.spaceId as spaceId',
        'b.author as author',
        'b.timestamp as timestamp',
      ])
      .addSelect(`SUBSTRING(b.content, 1, ${this.blogIconLength})`, 'content')
      .addSelect('(SELECT COUNT(*) FROM likes WHERE blogId = b.id)', 'likeCount')
      .addSelect('(SELECT COUNT(*) FROM comments WHERE blogId = b.id)', 'commentCount')
      .addSelect(
        `(SELECT COUNT(*) FROM comments WHERE blogId = b.id AND timestamp > ${
          currentTime - oneDayInMs
        })`,
        'recentCommentCount',
      )
      .where((qb) => {
        const memberSpaces = qb
          .subQuery()
          .select('spaceId')
          .from(Member, 'm')
          .where('m.memberId = :memberId AND m.spaceId != :publicSpaceId')
          .getQuery();

        const following = qb
          .subQuery()
          .select('followingId')
          .from(Follow, 'f')
          .where('f.followerId = :memberId')
          .getQuery();

        return (
          '(b.spaceId IN ' +
          memberSpaces +
          ') OR ' +
          '(b.userId IN ' +
          following +
          ' AND b.spaceId = :publicSpaceId) OR ' +
          'b.userId = :memberId'
        );
      })
      .setParameters({
        memberId,
        publicSpaceId: '1',
      })
      .getRawMany();

    // Calculate score and paginate in JS
    const scoredResults = rawResults.map((r) => {
      const likeScore = Math.log(1 + Number(r.likeCount)) / Math.log(100);
      const commentScore = Math.log(1 + Number(r.commentCount)) / Math.log(50);
      const recentCommentScore = Math.log(1 + Number(r.recentCommentCount)) / Math.log(20);
      const timeScore = Math.exp(-(currentTime - Number(r.timestamp)) / twoDaysInMs);

      const score =
        timeScore * 0.4 + likeScore * 0.25 + commentScore * 0.2 + recentCommentScore * 0.15;
      return { ...r, score };
    });

    const paginatedResults = scoredResults
      .sort((a, b) => b.score - a.score || Number(b.timestamp) - Number(a.timestamp))
      .slice(offset, offset + pageSize);

    return this.create(
      paginatedResults.map((result) => ({
        id: result.id,
        title: result.title,
        content: result.content,
        userId: result.userId,
        spaceId: result.spaceId,
        author: result.author,
        timestamp: Number(result.timestamp),
      })),
    );
  }

  async getSmartPublicFeeds(pageSize: number, offset: number): Promise<Blog[]> {
    const currentTime = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

    const rawResults = await this.createQueryBuilder('b')
      .select([
        'b.id as id',
        'b.title as title',
        'b.userId as userId',
        'b.spaceId as spaceId',
        'b.author as author',
        'b.timestamp as timestamp',
      ])
      .addSelect(`SUBSTRING(b.content, 1, ${this.blogIconLength})`, 'content')
      .addSelect('(SELECT COUNT(*) FROM likes WHERE blogId = b.id)', 'likeCount')
      .addSelect('(SELECT COUNT(*) FROM comments WHERE blogId = b.id)', 'commentCount')
      .addSelect(
        `(SELECT COUNT(*) FROM comments WHERE blogId = b.id AND timestamp > ${
          currentTime - oneDayInMs
        })`,
        'recentCommentCount',
      )
      .leftJoin('b.space', 's')
      .where('s.status = :status OR b.spaceId = :publicSpaceId', {
        status: 'public',
        publicSpaceId: '1',
      })
      .getRawMany();

    // Calculate score and paginate in JS
    const scoredResults = rawResults.map((r) => {
      const likeScore = Math.log(1 + Number(r.likeCount)) / Math.log(100);
      const commentScore = Math.log(1 + Number(r.commentCount)) / Math.log(50);
      const recentCommentScore = Math.log(1 + Number(r.recentCommentCount)) / Math.log(20);
      const timeScore = Math.exp(-(currentTime - Number(r.timestamp)) / twoDaysInMs);

      const score =
        timeScore * 0.4 + likeScore * 0.25 + commentScore * 0.2 + recentCommentScore * 0.15;
      return { ...r, score };
    });

    const paginatedResults = scoredResults
      .sort((a, b) => b.score - a.score || Number(b.timestamp) - Number(a.timestamp))
      .slice(offset, offset + pageSize);

    return this.create(
      paginatedResults.map((result) => ({
        id: result.id,
        title: result.title,
        content: result.content,
        userId: result.userId,
        spaceId: result.spaceId,
        author: result.author,
        timestamp: Number(result.timestamp),
      })),
    );
  }

  async findById(id: string): Promise<Blog | null> {
    return this.findOne({
      where: { id },
      relations: ['user', 'space', 'comments', 'likes'],
    });
  }

  // async findBySpaceId(spaceId: string, pageSize: number, offset: number): Promise<Feed[]> {
  //   return this.find({
  //     where: { spaceId },
  //     relations: ['user', 'space'],
  //     take: pageSize,
  //     skip: offset,
  //     order: { timestamp: 'DESC' },
  //   });
  // }
}
