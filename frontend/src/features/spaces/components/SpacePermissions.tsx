import { AllowedRole, SpacePermissionType } from '@nest/shared';

import React from 'react';

import { useSpacePermissions, useUpdatePermission } from '../hooks/usePermissions';

import '../styles/permissions.css';

interface SpacePermissionsProps {
  spaceId: string;
}

export const SpacePermissions: React.FC<SpacePermissionsProps> = ({ spaceId }) => {
  const { data, isLoading } = useSpacePermissions(spaceId);
  const { mutate: updatePermission } = useUpdatePermission(spaceId);

  if (isLoading) return <div>Loading permissions...</div>;

  const permissions = data?.permissions || [];

  const handleUpdate = (permission: SpacePermissionType, role: string) => {
    updatePermission({ permission, allowedRole: role as AllowedRole });
  };

  const getRoleForPermission = (type: SpacePermissionType) => {
    const perm = permissions.find(p => p.permission === type);
    return perm?.allowedRole || AllowedRole.MEMBER; // Default to MEMBER
  };

  return (
    <div className="space-permissions">
      <div className="space-permissions__header">
        <h3>Space Permissions</h3>
        <p>Configure who can perform actions in this space.</p>
      </div>

      <div className="space-permissions__list">
        <div className="space-permissions__item">
          <span className="space-permissions__label">Post Blogs</span>
          <select
            className="space-permissions__select"
            value={getRoleForPermission(SpacePermissionType.POST_BLOG)}
            onChange={e => handleUpdate(SpacePermissionType.POST_BLOG, e.target.value)}
          >
            <option value={AllowedRole.OWNER}>Owner Only</option>
            <option value={AllowedRole.ADMIN}>Admins & Owner</option>
            <option value={AllowedRole.MEMBER}>Members (All)</option>
          </select>
        </div>

        <div className="space-permissions__item">
          <span className="space-permissions__label">Send Chat Messages</span>
          <select
            className="space-permissions__select"
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
