import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpacePermission } from '../entities/space-permission.entity';
import { Space } from '../entities/space.entity';
import { Member } from '../entities/member.entity';
import { UpdateSpacePermissionReq, GetSpacePermissionsRes } from '../dto/space-permissions.dto';
import { SpacePermissionType, AllowedRole } from '@nest/shared';

@Injectable()
export class SpacePermissionService {
  constructor(
    @InjectRepository(SpacePermission)
    private permissionRepository: Repository<SpacePermission>,
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async updatePermission(
    userId: string,
    spaceId: string,
    req: UpdateSpacePermissionReq,
  ): Promise<GetSpacePermissionsRes> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    // Only owner can update permissions
    if (space.ownerId !== userId) {
      throw new ForbiddenException('Only space owner can manage permissions');
    }

    let permission = await this.permissionRepository.findOne({
      where: { spaceId, permission: req.permission },
    });

    if (!permission) {
      // Should exist from seeding, but handle creation if missing
      permission = new SpacePermission();
      permission.id = crypto.randomUUID();
      permission.spaceId = spaceId;
      permission.permission = req.permission;
    }

    permission.allowedRole = req.allowedRole;
    await this.permissionRepository.save(permission);

    return this.getPermissions(spaceId);
  }

  async getPermissions(spaceId: string): Promise<GetSpacePermissionsRes> {
    const permissions = await this.permissionRepository.find({ where: { spaceId } });

    return {
      permissions: permissions.map((p) => ({
        id: p.id,
        permission: p.permission,
        allowedRole: p.allowedRole,
      })),
    };
  }

  /**
   * Check if a user has permission to perform an action in a space
   */
  async checkPermission(
    userId: string,
    spaceId: string,
    action: SpacePermissionType,
  ): Promise<boolean> {
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) return false;

    // Owner always has permission
    if (space.ownerId === userId) return true;

    const permissionSetting = await this.permissionRepository.findOne({
      where: { spaceId, permission: action },
    });

    // Default to MEMBER if not set
    const requiredRole = permissionSetting ? permissionSetting.allowedRole : AllowedRole.MEMBER;

    if (requiredRole === AllowedRole.EVERYONE) return true;

    const member = await this.memberRepository.findOne({ where: { spaceId, memberId: userId } });
    if (!member) return false;

    if (requiredRole === AllowedRole.MEMBER) return true;
    if (requiredRole === AllowedRole.ADMIN) return member.isAdmin;
    if (requiredRole === AllowedRole.OWNER) return false; // Already checked owner above

    return false;
  }
}
