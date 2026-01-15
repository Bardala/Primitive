import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserActivity } from '../entities/user-activity.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Follow } from 'src/modules/shared/entities/follow.entity';
import { Space } from 'src/modules/space/entities/space.entity';
import { Member } from 'src/modules/space/entities/member.entity';
import { randomUUID } from 'crypto';
import {
  CreateUserDto,
  UpdateUserDto,
  GetUserCardRes,
  UpdatePasswordReq,
  UserBlogsRes,
} from '../dto';
import { DefaultSpaceId } from '@nest/shared';
import { IUserService, IUserFollowService } from './interfaces';

@Injectable()
export class UserService implements IUserService, IUserFollowService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserActivity) private userActivityRepository: Repository<UserActivity>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(Space) private spaceRepository: Repository<Space>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing email
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check for existing username
    const existingUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const user = this.userRepository.create(createUserDto);
    const member = this.memberRepository.create({
      memberId: randomUUID(),
      spaceId: DefaultSpaceId,
    });
    await this.memberRepository.save(member);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<{ id: string; username: string }[]> {
    const users = await this.userRepository.find({
      select: ['id', 'username'],
    });
    return users;
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['activity'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [{ email: login }, { username: login }],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(id, updateUserDto);
    return await this.findById(id);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordReq): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(updatePasswordDto.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Incorrect password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 12);
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async getUserCard(currentUserId: string, targetUserId: string): Promise<GetUserCardRes> {
    const user = await this.userRepository.findOne({
      where: { id: targetUserId },
      select: ['id', 'username', 'email', 'timestamp'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if current user is following target user
    const isFollowing = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    // Get follower count
    const followerCount = await this.followRepository.count({
      where: { followingId: targetUserId },
    });

    // Get following count
    const followingCount = await this.followRepository.count({
      where: { followerId: targetUserId },
    });

    const userCardDto = new GetUserCardRes();
    userCardDto.userCard = {
      ...user,
      isFollowing: isFollowing ? 1 : 0,
      followersNum: followerCount,
      followingNum: followingCount,
    };

    return userCardDto;
  }

  async getFollowers(userId: string): Promise<{ id: string; username: string }[]> {
    const followers = await this.followRepository.find({
      where: { followingId: userId },
      relations: ['follower'],
    });

    return followers.map((follow) => ({
      id: follow.follower.id,
      username: follow.follower.username,
    }));
  }

  async createFollow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    const follow = this.followRepository.create({
      followerId,
      followingId,
    });

    await this.followRepository.save(follow);
  }

  async deleteFollow(followerId: string, followingId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      throw new BadRequestException('Not following this user');
    }

    await this.followRepository.remove(follow);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    return !!follow;
  }

  async getUserBlogs(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<UserBlogsRes> {
    const offset = (page - 1) * pageSize;

    const [blogs, _total] = await this.blogRepository.findAndCount({
      where: { userId },
      relations: ['user', 'space'],
      order: { timestamp: 'DESC' },
      skip: offset,
      take: pageSize,
    });

    return {
      blogs: blogs
        // todo: implement it in the database
        .filter((b) => b.space.status !== 'private')
        .map((b) => ({ ...b, content: b.content.substring(0, 500) })),
      page,
    };
  }

  async getUserSpaces(userId: string): Promise<any[]> {
    const spaces = await this.spaceRepository.find({
      where: { ownerId: userId },
      select: ['id', 'name', 'description', 'status', 'timestamp'],
    });

    return spaces;
  }

  async updateLastActive(userId: string): Promise<void> {
    await this.userActivityRepository.upsert({ userId, lastActive: new Date() }, ['userId']);
  }
}
