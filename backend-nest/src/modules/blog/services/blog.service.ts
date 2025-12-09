import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Blog } from '../entities/blog.entity';
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
import { Like } from 'src/modules/shared/entities/like.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Member } from 'src/modules/space/entities/member.entity';
import { DefaultSpaceId } from '@nest/shared';
import { IBlogService } from './interfaces';

@Injectable()
export class BlogService implements IBlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async createBlog(userId: string, req: CreateBlogReq): Promise<CreateBlogRes> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const space = req.spaceId
      ? await this.spaceRepository.findOne({ where: { id: req.spaceId } })
      : await this.spaceRepository.findOne({ where: { id: DefaultSpaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    // Check if user is member of space
    const isMember = await this.checkMembership(space.id, userId);
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this space');
    }

    const blog = new Blog();
    blog.id = randomUUID();
    blog.title = req.title;
    blog.content = req.content;
    blog.spaceId = space.id;
    blog.userId = userId;
    blog.author = user.username;
    blog.timestamp = Date.now();

    await this.blogRepository.save(blog);

    return { blog };
  }

  async updateBlog(userId: string, blogId: string, req: UpdateBlogReq): Promise<UpdateBlogRes> {
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.userId !== userId) {
      throw new ForbiddenException('You can only update your own blogs');
    }

    const space = await this.spaceRepository.findOne(
      req.spaceId ? { where: { id: req.spaceId } } : { where: { id: DefaultSpaceId } },
    );
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const isMember = await this.checkMembership(space.id, userId);
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this space');
    }

    blog.title = req.title;
    blog.content = req.content;

    await this.blogRepository.save(blog);

    return { statusMessage: 'Blog updated successfully' };
  }

  async getBlog(userId: string | undefined, blogId: string): Promise<BlogRes> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: ['space', 'user'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if space is private and user is member
    if (blog.space.status === 'private') {
      if (!userId) {
        throw new ForbiddenException('This blog is in a private space');
      }
      const isMember = await this.checkMembership(blog.spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This blog is in a private space');
      }
    }

    return { blog };
  }

  async deleteBlog(userId: string, blogId: string): Promise<DeleteBlogRes> {
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.userId !== userId) {
      throw new ForbiddenException('You can only delete your own blogs');
    }

    await this.blogRepository.delete(blogId);

    return { message: 'OK' };
  }

  async getBlogComments(userId: string | undefined, blogId: string): Promise<BlogCommentsRes> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: ['space', 'comments'],
    });
    if (!blog) throw new NotFoundException('Blog not found');

    // Check if space is private
    if (blog.space.status === 'private') {
      if (!userId) {
        throw new ForbiddenException('This blog is in a private space');
      }
      const isMember = await this.checkMembership(blog.spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This blog is in a private space');
      }
    }

    // const comments = await this.commentRepository.find({
    //   where: { blogId },
    //   relations: ['author'],
    //   order: { timestamp: 'DESC' },
    // });

    return { comments: blog.comments as any };
  }

  async likeBlog(userId: string, blogId: string): Promise<CreateLikeRes> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: ['space'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if user is member of space
    if (blog.space.status === 'private') {
      const isMember = await this.checkMembership(blog.spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This blog is in a private space');
      }
    }

    // Check if already liked
    const alreadyLiked = await this.likeRepository.exists({
      where: { blogId, userId },
    });

    if (alreadyLiked) {
      throw new ConflictException('Already liked');
    }

    const like = new Like();
    like.blogId = blogId;
    like.userId = userId;

    await this.likeRepository.save(like);

    return { message: 'OK' };
  }

  async unlikeBlog(userId: string, blogId: string): Promise<RemoveLikeRes> {
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const like = await this.likeRepository.exists({
      where: { blogId, userId },
    });

    if (!like) {
      throw new ConflictException('Not liked');
    }

    await this.likeRepository.delete({ blogId, userId });

    return { message: 'OK' };
  }

  async getBlogLikes(userId: string | undefined, blogId: string): Promise<BlogLikesRes> {
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const likes = await this.likeRepository.count({ where: { blogId } });

    let isLiked = false;
    if (userId) {
      const userLike = await this.likeRepository.findOne({
        where: { blogId, userId },
      });
      isLiked = !!userLike;
    }

    return { likes, isLiked };
  }

  async getBlogLikesList(userId: string | undefined, blogId: string): Promise<BlogLikesListRes> {
    const blog = await this.blogRepository.findOne({
      where: { id: blogId },
      relations: ['space'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if space is private
    if (blog.space.status === 'private' && userId) {
      const isMember = await this.checkMembership(blog.spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This blog is in a private space');
      }
    }

    const likes = await this.likeRepository.find({
      where: { blogId },
      relations: ['user'],
    });

    const users = likes.map((like) => ({
      id: like.user.id,
      username: like.user.username,
    }));

    return { users };
  }

  async getNumOfComments(blogId: string): Promise<NumOfCommentsRes> {
    const count = await this.commentRepository.count({
      where: { blogId },
    });

    return { numOfComments: count };
  }

  private async checkMembership(spaceId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: {
        spaceId: spaceId,
        memberId: userId,
      },
    });
    return !!member;
  }
}
