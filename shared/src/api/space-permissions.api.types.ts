import { AllowedRole, SpacePermissionType } from '../types';

export interface UpdateSpacePermissionReq {
  permission: SpacePermissionType;
  allowedRole: AllowedRole;
}

export interface GetSpacePermissionsRes {
  permissions: {
    id: string;
    permission: SpacePermissionType;
    allowedRole: AllowedRole;
  }[];
}
