import { AllowedRole, SpacePermission, SpacePermissionType } from '@nest/shared';

export interface SpacePermissionDao {
  setPermission(permission: SpacePermission): Promise<void>;
  getSpacePermissions(spaceId: string): Promise<SpacePermission[]>;
  getPermission(
    spaceId: string,
    permission: SpacePermissionType
  ): Promise<SpacePermission | undefined>;
  updatePermission(
    spaceId: string,
    permission: SpacePermissionType,
    allowedRole: AllowedRole
  ): Promise<void>;
  deleteSpacePermissions(spaceId: string): Promise<void>;
  getUserPermissionLevel(
    spaceId: string,
    userId: string
  ): Promise<'owner' | 'admin' | 'member' | null>;
  canUserPerformAction(
    spaceId: string,
    userId: string,
    permission: SpacePermissionType
  ): Promise<boolean>;
}
