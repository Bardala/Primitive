import { DefaultSpaceId } from '@nest/shared';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { ChatMessage } from 'src/modules/chat/entities/chat-message.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AddMemberReq, AddMemberRes } from '../dto/add-member.dto';
import { CreateSpaceReq, CreateSpaceRes } from '../dto/create-space.dto';
import { DefaultSpaceRes } from '../dto/default-space.dto';
import { DeleteMemRes } from '../dto/delete-member.dto';
import { DeleteSpaceRes } from '../dto/delete-space.dto';
import { MembersRes } from '../dto/get-members.dto';
import { SpaceRes } from '../dto/get-space.dto';
import { JoinSpaceRes } from '../dto/join-space.dto';
import { LeaveSpaceRes } from '../dto/leave-space.dto';
import { SpaceBlogsRes } from '../dto/space-blogs.dto';
import { ChatRes } from '../dto/space-chat.dto';
import { UnReadMsgsNumRes } from '../dto/unread-msgs-num.dto';
import { UpdateSpaceReq, UpdateSpaceRes } from '../dto/update-space.dto';
import { Member } from '../entities/member.entity';
import { Space } from '../entities/space.entity';

const PAGE_SIZE = 10;

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ChatMessage)
    private chatRepository: Repository<ChatMessage>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  private readonly logger = new Logger(SpaceService.name);

  async createSpace(userId: string, req: CreateSpaceReq): Promise<CreateSpaceRes> {
    if (!req.name || !req.description || !req.status) {
      throw new BadRequestException('All fields are required');
    }

    const space = new Space();
    space.id = randomUUID();
    space.name = req.name;
    space.description = req.description;
    space.status = req.status;
    space.ownerId = userId;
    space.timestamp = Date.now();

    await this.spaceRepository.save(space);

    // Add owner as admin member
    const member = new Member();
    member.spaceId = space.id;
    member.memberId = userId;
    member.isAdmin = true;

    await this.memberRepository.save(member);

    return { space };
  }

  async getSpace(userId: string | undefined, spaceId: string): Promise<SpaceRes> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (space.status === 'private' && userId) {
      const isMember = await this.checkMembership(spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This space is private');
      }
    }

    return { space };
  }

  async updateSpace(userId: string, spaceId: string, req: UpdateSpaceReq): Promise<UpdateSpaceRes> {
    if (!req.name || !req.description || !req.status) {
      throw new BadRequestException('All fields are required');
    }

    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (space.ownerId !== userId) {
      throw new ForbiddenException('Only owner can update space');
    }

    space.name = req.name;
    space.description = req.description;
    space.status = req.status;

    await this.spaceRepository.save(space);

    return { space };
  }

  async deleteSpace(userId: string, spaceId: string): Promise<DeleteSpaceRes> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (space.ownerId !== userId) {
      throw new ForbiddenException('Only owner can delete space');
    }

    await this.spaceRepository.delete(spaceId);

    return { statusMessage: 'Space deleted successfully' };
  }

  async getDefaultSpace(): Promise<DefaultSpaceRes> {
    let space = await this.spaceRepository.findOne({ where: { id: '1' } });
    if (!space) {
      const firstUser = await this.getFirstCreatedUser();

      space = new Space();
      space.id = '1';
      space.name = 'Default Space';
      space.description = 'Default Space';
      space.status = 'public';
      space.ownerId = firstUser.id;
      space.timestamp = Date.now();

      await this.spaceRepository.save(space);
      await this.joinSpace(firstUser.id, space.id);
    }

    return { space };
  }

  private async getFirstCreatedUser(): Promise<User> {
    const firstUser = await this.userRepository.findOne({
      where: {},
      order: { timestamp: 'ASC' },
    });

    if (!firstUser)
      throw new BadRequestException('No users found in database to assign as space owner');

    return firstUser;
  }

  async joinSpace(userId: string, spaceId: string): Promise<JoinSpaceRes> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (space.status === 'private') {
      throw new ForbiddenException('Cannot join private space');
    }

    const existingMember = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId },
    });

    if (existingMember) {
      throw new ConflictException('Already a member');
    }

    const member = new Member();
    member.spaceId = spaceId;
    member.memberId = userId;
    member.isAdmin = false;

    await this.memberRepository.save(member);

    return { member: member as any };
  }

  async leaveSpace(userId: string, spaceId: string): Promise<LeaveSpaceRes> {
    this.logger.log(userId, spaceId);
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (space.ownerId === userId) {
      throw new ForbiddenException('Owner cannot leave space');
    }

    const member = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId },
    });

    this.logger.log(member);

    if (!member) {
      throw new NotFoundException('Not a member');
    }

    await this.memberRepository.delete({ spaceId, memberId: userId });

    return { statusMessage: 'Left space successfully' };
  }

  async addMember(userId: string, spaceId: string, req: AddMemberReq): Promise<AddMemberRes> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const isAdmin = await this.checkAdmin(spaceId, userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can add members');
    }

    const newMember = await this.userRepository.findOne({
      where: [{ username: req.member }, { id: req.member }],
    });

    if (!newMember) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.memberRepository.findOne({
      where: { spaceId, memberId: newMember.id },
    });

    if (existingMember) {
      throw new ConflictException('Already a member');
    }

    const member = new Member();
    member.spaceId = spaceId;
    member.memberId = newMember.id;
    member.isAdmin = req.isAdmin ?? false;

    await this.memberRepository.save(member);

    return { member: member as any };
  }

  async getMembers(userId: string, spaceId: string): Promise<MembersRes> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const isMember = await this.checkMembership(spaceId, userId);
    if (!isMember) {
      throw new ForbiddenException('Not a member');
    }

    const members = await this.memberRepository.find({ where: { spaceId } });

    return { members: members as any };
  }

  async deleteMember(userId: string, spaceId: string, memberId: string): Promise<DeleteMemRes> {
    const isAdmin = await this.checkAdmin(spaceId, userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can remove members');
    }

    const member = await this.memberRepository.findOne({
      where: { spaceId, memberId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.memberRepository.delete({ spaceId, memberId });

    return { statusMessage: 'Member removed successfully' };
  }

  async getChat(userId: string, spaceId: string): Promise<ChatRes> {
    const isMember = await this.checkMembership(spaceId, userId);
    if (!isMember) {
      throw new ForbiddenException('Not a member');
    }

    const messages = await this.chatRepository.find({
      where: { spaceId },
      order: { timestamp: 'DESC' },
      take: 50,
    });

    return { messages: messages as any };
  }

  async getUnreadCount(userId: string, spaceId: string): Promise<UnReadMsgsNumRes> {
    const isMember = await this.checkMembership(spaceId, userId);
    if (!isMember) {
      throw new ForbiddenException('Not a member');
    }

    // Placeholder - needs proper implementation with LastRead tracking
    const count = 0;

    return { numOfUnReadMsgs: count };
  }

  async getBlogs(
    userId: string | undefined,
    spaceId: string,
    page: number,
  ): Promise<SpaceBlogsRes> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (space.status === 'private' && userId) {
      const isMember = await this.checkMembership(spaceId, userId);
      if (!isMember) {
        throw new ForbiddenException('This space is private');
      }
    }

    const offset = (page - 1) * PAGE_SIZE;
    const blogs = await this.blogRepository.find({
      where: { spaceId },
      skip: offset,
      take: PAGE_SIZE,
      order: { timestamp: 'DESC' },
      relations: ['space', 'seriesLinks', 'seriesLinks.series', 'tags'],
    });

    return { blogs, page };
  }

  async getDefaultSpaceBlogs(_userId: string | undefined, page: number): Promise<SpaceBlogsRes> {
    const offset = (page - 1) * PAGE_SIZE;
    const blogs = await this.blogRepository.find({
      where: { spaceId: DefaultSpaceId },
      skip: offset,
      take: PAGE_SIZE,
      order: { timestamp: 'DESC' },
      relations: ['space', 'seriesLinks', 'seriesLinks.series', 'tags'],
    });

    return { blogs, page };
  }

  private async checkMembership(spaceId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId },
    });

    return !!member;
  }

  private async checkAdmin(spaceId: string, userId: string): Promise<boolean> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (space.ownerId === userId) {
      return true;
    }

    const member = await this.memberRepository.findOne({
      where: { spaceId, memberId: userId, isAdmin: true },
    });

    return !!member;
  }
}
