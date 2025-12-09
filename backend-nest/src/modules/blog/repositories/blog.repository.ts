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
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const oneDayInMs = 24 * 60 * 60 * 1000;

    const blogScoresQuery = this.createQueryBuilder('b')
      .select([
        'b.id as id',
        'b.title as title',
        'b.userId as userId',
        'b.spaceId as spaceId',
        'b.author as author',
        'b.timestamp as timestamp',
        `SUBSTRING(b.content, 1, ${this.blogIconLength}) as content`,
        `EXP(-(${currentTime} - b.timestamp) / ${twoDaysInMs}) as time_score`,
        `LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) as like_score`,
        `LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) as comment_score`,
        `LOG(1 + COUNT(DISTINCT CASE 
          WHEN rc.timestamp > ${currentTime} - ${oneDayInMs} 
          THEN rc.id END
        )) / LOG(20) as recent_comment_score`,
        `(EXP(-(${currentTime} - b.timestamp) / ${twoDaysInMs}) * 0.4) +
         (LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) * 0.25) +
         (LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) * 0.2) +
         (LOG(1 + COUNT(DISTINCT CASE 
           WHEN rc.timestamp > ${currentTime} - ${oneDayInMs} 
           THEN rc.id END
         )) / LOG(20) * 0.15) as score`,
      ])
      .leftJoin('b.likes', 'l')
      .leftJoin('b.comments', 'c')
      .leftJoin('b.comments', 'rc')
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
      .groupBy('b.id, b.title, b.content, b.userId, b.spaceId, b.author, b.timestamp')
      .getRawMany();

    const rawResults = await blogScoresQuery;

    // Convert raw results to Blog entities with pagination
    const paginatedResults = rawResults
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return (
          new Date(b.timestamp as number).getTime() - new Date(a.timestamp as number).getTime()
        );
      })
      .slice(offset, offset + pageSize);

    const blogs: Blog[] = this.create(
      paginatedResults.map((result) => ({
        id: result.id,
        title: result.title,
        content: result.content,
        userId: result.userId,
        spaceId: result.spaceId,
        author: result.author,
        timestamp: result.timestamp,
      })),
    );

    return blogs;
  }

  async getSmartPublicFeeds(pageSize: number, offset: number): Promise<Blog[]> {
    const currentTime = Date.now();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const oneDayInMs = 24 * 60 * 60 * 1000;

    const blogScoresQuery = this.createQueryBuilder('b')
      .select([
        'b.id as id',
        'b.title as title',
        'b.userId as userId',
        'b.spaceId as spaceId',
        'b.author as author',
        'b.timestamp as timestamp',
        `SUBSTRING(b.content, 1, ${this.blogIconLength}) as content`,
        `EXP(-(${currentTime} - b.timestamp) / ${twoDaysInMs}) as time_score`,
        `LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) as like_score`,
        `LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) as comment_score`,
        `LOG(1 + COUNT(DISTINCT CASE 
          WHEN rc.timestamp > ${currentTime} - ${oneDayInMs} 
          THEN rc.id END
        )) / LOG(20) as recent_comment_score`,
        `(EXP(-(${currentTime} - b.timestamp) / ${twoDaysInMs}) * 0.4) +
         (LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) * 0.25) +
         (LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) * 0.2) +
         (LOG(1 + COUNT(DISTINCT CASE 
           WHEN rc.timestamp > ${currentTime} - ${oneDayInMs} 
           THEN rc.id END
         )) / LOG(20) * 0.15) as score`,
      ])
      .leftJoin('b.likes', 'l')
      .leftJoin('b.comments', 'c')
      .leftJoin('b.comments', 'rc')
      .leftJoin('b.space', 's')
      .where('s.status = :status OR b.spaceId = :publicSpaceId', {
        status: 'public',
        publicSpaceId: '1',
      })
      .groupBy('b.id, b.title, b.content, b.userId, b.spaceId, b.author, b.timestamp')
      .getRawMany();

    const rawResults = await blogScoresQuery;

    // Convert raw results to Blog entities with pagination
    const paginatedResults = rawResults
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return (
          new Date(b.timestamp as number).getTime() - new Date(a.timestamp as number).getTime()
        );
      })
      .slice(offset, offset + pageSize);

    // const feeds = paginatedResults.map((b: Blog) => new Feed(b));
    return paginatedResults as Blog[];
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
