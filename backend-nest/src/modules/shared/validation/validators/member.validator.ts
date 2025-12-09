import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from 'src/modules/space/entities/member.entity';
import { BaseValidator } from '../base.validator';

/**
 * Member entity validator
 * Handles validation for Member entities and space membership
 */
@Injectable()
export class MemberValidator extends BaseValidator<Member> {
  constructor(
    @InjectRepository(Member)
    memberRepository: Repository<Member>,
  ) {
    super(memberRepository);
  }

  /**
   * Validates that a member exists by member ID
   * @param memberId - The member ID to validate
   * @returns The found member
   */
  async validateMemberExists(memberId: string): Promise<Member> {
    return this.validateExists(memberId, 'Member not found');
  }

  /**
   * Validates that a user is a member of a space
   * @param spaceId - The space ID
   * @param userId - The user ID to check membership
   * @throws ForbiddenException if user is not a member of the space
   */
  async validateUserIsSpaceMember(spaceId: string, userId: string): Promise<boolean> {
    const member = await this.repository.findOne({
      where: {
        spaceId,
        memberId: userId,
      },
    });

    if (!member) {
      throw new ForbiddenException('User is not a member of this space');
    }

    return true;
  }

  /**
   * Helper method to check if user is a member of a space
   * @param spaceId - The space ID
   * @param userId - The user ID
   * @returns true if user is a member, false otherwise
   */
  async checkMembership(spaceId: string, userId: string): Promise<boolean> {
    const member = await this.repository.findOne({
      where: {
        spaceId,
        memberId: userId,
      },
    });
    return !!member;
  }

  protected getEntityName(): string {
    return 'Member';
  }
}
