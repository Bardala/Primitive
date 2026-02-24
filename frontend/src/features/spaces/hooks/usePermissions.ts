import { ApiError } from '@/core/services';

import { GetSpacePermissionsRes, UpdateSpacePermissionReq } from '@nest/shared';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PermissionsApi } from '../api/permissions.api';

export const useSpacePermissions = (spaceId: string) => {
  return useQuery<GetSpacePermissionsRes, ApiError>(
    ['permissions', spaceId],
    () => PermissionsApi.getPermissions(spaceId),
    {
      enabled: !!spaceId,
    }
  );
};

export const useUpdatePermission = (spaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation<GetSpacePermissionsRes, ApiError, UpdateSpacePermissionReq>(
    data => PermissionsApi.updatePermission(spaceId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['permissions', spaceId]);
      },
    }
  );
};
