import { getFn, putFn } from '@/core/services';

import { ENDPOINT, GetSpacePermissionsRes, UpdateSpacePermissionReq } from '@nest/shared';

export const PermissionsApi = {
  getPermissions: (spaceId: string) =>
    getFn<GetSpacePermissionsRes>(ENDPOINT.GET_SPACE_PERMISSIONS, [spaceId]),

  updatePermission: (spaceId: string, data: UpdateSpacePermissionReq) =>
    putFn<UpdateSpacePermissionReq, GetSpacePermissionsRes>(
      ENDPOINT.UPDATE_SPACE_PERMISSIONS,
      data,
      [spaceId]
    ),
};
