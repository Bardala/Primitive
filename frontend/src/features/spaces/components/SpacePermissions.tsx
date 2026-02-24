import { AllowedRole, SpacePermissionType } from '@nest/shared';

import React from 'react';

import { useSpacePermissions, useUpdatePermission } from '../hooks/usePermissions';

interface SpacePermissionsProps {
  spaceId: string;
}

export const SpacePermissions: React.FC<SpacePermissionsProps> = ({ spaceId }) => {
  const { data, isLoading } = useSpacePermissions(spaceId);
  const { mutate: updatePermission } = useUpdatePermission(spaceId);

  if (isLoading)
    return (
      <div className="p-4 text-center text-text-secondary-light dark:text-text-secondary-dark">
        Loading permissions...
      </div>
    );

  const permissions = data?.permissions || [];

  const handleUpdate = (permission: SpacePermissionType, role: string) => {
    updatePermission({ permission, allowedRole: role as AllowedRole });
  };

  const getRoleForPermission = (type: SpacePermissionType) => {
    const perm = permissions.find(p => p.permission === type);
    return perm?.allowedRole || AllowedRole.MEMBER; // Default to MEMBER
  };

  return (
    <div className="card-base p-6">
      <div className="mb-6 border-b border-border-light pb-4 dark:border-border-dark">
        <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          Space Permissions
        </h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Configure who can perform actions in this space.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark sm:flex-row sm:items-center">
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
            Post Blogs
          </span>
          <select
            className="input-base w-full sm:w-48"
            value={getRoleForPermission(SpacePermissionType.POST_BLOG)}
            onChange={e => handleUpdate(SpacePermissionType.POST_BLOG, e.target.value)}
          >
            <option value={AllowedRole.OWNER}>Owner Only</option>
            <option value={AllowedRole.ADMIN}>Admins & Owner</option>
            <option value={AllowedRole.MEMBER}>Members (All)</option>
          </select>
        </div>

        <div className="flex flex-col justify-between gap-2 rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark sm:flex-row sm:items-center">
          <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
            Send Chat Messages
          </span>
          <select
            className="input-base w-full sm:w-48"
            value={getRoleForPermission(SpacePermissionType.SEND_CHAT)}
            onChange={e => handleUpdate(SpacePermissionType.SEND_CHAT, e.target.value)}
          >
            <option value={AllowedRole.OWNER}>Owner Only</option>
            <option value={AllowedRole.ADMIN}>Admins & Owner</option>
            <option value={AllowedRole.MEMBER}>Members (All)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
